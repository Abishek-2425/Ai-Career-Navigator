const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const huggingfaceService = require('./huggingfaceService');
const personalInfoExtractor = require('./personalInfoExtractor');
const jobMatcher = require('./jobMatcher');
const logger = require('./logger');

class ResumeProcessor {
    constructor() {
        this.commonSections = [
            'education',
            'experience',
            'skills',
            'projects',
            'certifications',
            'summary',
            'objective'
        ];
        this.actionVerbsList = [
            'achieved', 'improved', 'trained', 'managed', 'created',
            'developed', 'implemented', 'increased', 'decreased', 'resolved',
            'negotiated', 'launched', 'coordinated', 'generated', 'reduced',
            'supervised', 'established', 'expanded', 'directed', 'organized'
        ];
    }

    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            throw new Error(`Error extracting text from PDF: ${error.message}`);
        }
    }

    async extractTextFromDOCX(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            throw new Error(`Error extracting text from DOCX: ${error.message}`);
        }
    }

    async extractText(filePath) {
        // Determine file type from extension
        const fileType = path.extname(filePath).toLowerCase();
        
        if (fileType === '.pdf') {
            return this.extractTextFromPDF(filePath);
        } else if (fileType === '.docx' || fileType === '.doc') {
            return this.extractTextFromDOCX(filePath);
        }
        throw new Error(`Unsupported file type: ${fileType}. Only .pdf, .doc, and .docx files are supported.`);
    }

    identifySkills(text, skillsList) {
        const extractedSkills = [];
        skillsList.forEach(skill => {
            const regex = new RegExp(`\\b${skill}\\b`, 'gi');
            if (regex.test(text)) {
                extractedSkills.push(skill);
            }
        });
        return extractedSkills;
    }

    findMissingKeySkills(extractedSkills, requiredSkills) {
        return requiredSkills.filter(skill => 
            !extractedSkills.some(extracted => 
                extracted.toLowerCase() === skill.toLowerCase()
            )
        );
    }

    async analyzeActionVerbs(text) {
        try {
            // First use basic detection
            const foundVerbs = this.actionVerbsList.filter(verb => {
                const regex = new RegExp(`\\b${verb}\\b`, 'gi');
                return regex.test(text);
            });

            // Then use AI to find additional action verbs
            const aiVerbs = await huggingfaceService.detectActionVerbs(text);
            
            // Combine and remove duplicates
            return [...new Set([...foundVerbs, ...aiVerbs])];
        } catch (error) {
            console.error('Error analyzing action verbs:', error);
            return foundVerbs;
        }
    }

    async analyzeMeasurableAchievements(text) {
        try {
            return await huggingfaceService.detectMeasurableAchievements(text);
        } catch (error) {
            console.error('Error analyzing measurable achievements:', error);
            return [];
        }
    }

    analyzeSections(text) {
        const feedback = [];
        
        this.commonSections.forEach(section => {
            const sectionRegex = new RegExp(`\\b${section}\\b`, 'i');
            if (!sectionRegex.test(text)) {
                feedback.push({
                    section,
                    feedback: `Missing ${section} section`,
                    severity: 'high'
                });
            }
        });

        // Check for section content
        const sections = text.split(/\n(?=[A-Z][A-Za-z\s]+:?)/);
        sections.forEach(section => {
            const content = section.trim();
            if (content.length < 50) {
                feedback.push({
                    section: 'Content',
                    feedback: 'Section content appears too brief',
                    severity: 'medium'
                });
            }
        });

        return feedback;
    }

    calculateSectionScores(extractedSkills, actionVerbs, measurableAchievements, formatFeedback) {
        const scores = {
            formatting: 100,
            content: 100,
            achievements: 100,
            skills: 100
        };

        // Format score
        formatFeedback.forEach(feedback => {
            switch (feedback.severity) {
                case 'high': scores.formatting -= 20; break;
                case 'medium': scores.formatting -= 10; break;
                case 'low': scores.formatting -= 5; break;
            }
        });

        // Skills score
        scores.skills = Math.min(100, extractedSkills.length * 10);

        // Achievements score
        const hasActionVerbs = actionVerbs.length >= 5;
        const hasMeasurableAchievements = measurableAchievements.length >= 3;
        
        if (!hasActionVerbs) scores.achievements -= 50;
        if (!hasMeasurableAchievements) scores.achievements -= 50;

        // Normalize scores
        Object.keys(scores).forEach(key => {
            scores[key] = Math.max(0, Math.min(100, scores[key]));
        });

        return scores;
    }

    calculateOverallScore(sectionScores) {
        const weights = {
            formatting: 0.2,
            content: 0.3,
            achievements: 0.25,
            skills: 0.25
        };

        const weightedScore = Object.entries(sectionScores)
            .reduce((score, [key, value]) => score + (value * weights[key]), 0);

        return Math.round(weightedScore);
    }

    async extractSkills(text) {
        try {
            // Common technical skills and compound terms
            const commonSkills = [
                // Programming Languages
                'JavaScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
                // Web Technologies
                'HTML5?', 'CSS3?', 'React(?:\\.js)?', 'Angular(?:\\.js)?', 'Vue(?:\\.js)?', 'Node\\.js', 'Express(?:\\.js)?', 'Django', 'Flask',
                // Databases
                'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'Redis', 'Cassandra',
                // Cloud & DevOps
                'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git(?:Hub)?', 'CI/CD',
                // AI & ML
                'TensorFlow', 'PyTorch', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'NLP',
                // Data Science
                'Data Analysis', 'Data Science', 'R', 'Pandas', 'NumPy', 'Matplotlib', 'Tableau',
                // Mobile
                'iOS', 'Android', 'React Native', 'Flutter', 'Mobile Development',
                // Soft Skills
                'Problem Solving', 'Team Collaboration', 'Project Management', 'Communication Skills',
                // Other
                'Agile', 'Scrum', 'REST(?:ful)? APIs?', 'GraphQL', 'Microservices', 'Unit Testing', 'MERN Stack',
                'TypeScript', 'Redux', 'Socket\\.io', 'Material(?:-UI)?', 'Stripe'
            ];

            // Create a regex pattern that matches whole words and compound terms
            const skillPattern = new RegExp('\\b(' + commonSkills.join('|') + ')\\b', 'gi');
            
            // Find all matches
            const matches = [];
            let match;
            while ((match = skillPattern.exec(text)) !== null) {
                matches.push(match[0]);
            }
            
            // Remove duplicates and normalize case
            const uniqueSkills = [...new Set(matches.map(skill => {
                // Special case for multi-word skills that should be capitalized differently
                if (skill.toLowerCase() === 'javascript') return 'JavaScript';
                if (skill.toLowerCase() === 'typescript') return 'TypeScript';
                if (skill.toLowerCase().match(/^node\.?js$/)) return 'Node.js';
                if (skill.toLowerCase().match(/^react\.?js$/)) return 'React';
                if (skill.toLowerCase().match(/^vue\.?js$/)) return 'Vue';
                if (skill.toLowerCase().match(/^express\.?js$/)) return 'Express';
                if (skill.toLowerCase().match(/^restful?\s*apis?$/)) return 'RESTful API';
                if (skill.toLowerCase() === 'problem solving') return 'Problem Solving';
                if (skill.toLowerCase() === 'team collaboration') return 'Team Collaboration';
                return skill;
            }))];

            return uniqueSkills.filter(skill => skill.length > 1); // Filter out single characters
        } catch (error) {
            console.error('Error extracting skills:', error);
            return [];
        }
    }

    calculateFormattingScore(text) {
        let score = 70; // Base score
        
        // Check for sections
        const sectionCount = this.commonSections.filter(section => 
            new RegExp(section, 'i').test(text)
        ).length;
        score += Math.min(sectionCount * 5, 15);

        // Check for consistent formatting
        if (text.includes('\n\n')) score += 5;
        if (/[A-Z\s]{5,}/.test(text)) score += 5; // Section headers in caps
        if (/•|\-|\*/.test(text)) score += 5; // Bullet points
        
        return Math.min(score, 100);
    }

    calculateContentScore(text, actionVerbs) {
        let score = 60; // Base score
        
        // Check for action verbs
        score += Math.min(actionVerbs.length * 3, 15);
        
        // Check for quantifiable achievements
        const metrics = text.match(/\d+%|\$\d+|\d+ years|\d+\+?/g) || [];
        score += Math.min(metrics.length * 3, 15);
        
        // Check for detailed descriptions
        const bulletPoints = text.match(/[•\-\*]\s*[^•\-\*\n]+/g) || [];
        score += Math.min(bulletPoints.length, 10);
        
        return Math.min(score, 100);
    }

    // Before:
    async analyzeResume(text) {
      try {
        logger.info('Starting resume analysis...');
        
        // Extract personal info
        const personalInfo = await personalInfoExtractor.extract(text);
        logger.debug('Extracted personal info:', personalInfo);
        
        // Extract skills
        const extractedSkills = await this.extractSkills(text);
        logger.debug('Extracted skills:', extractedSkills);
    
        // Get required skills from job roles
        const requiredSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'];
        console.log('Got required skills');
    
        // Find missing key skills
        const missingKeySkills = this.findMissingKeySkills(extractedSkills, requiredSkills);
    
        // Analyze action verbs
        const actionVerbs = await this.analyzeActionVerbs(text);
        console.log('Analyzed action verbs:', actionVerbs);
    
        // Calculate section scores
        const sectionScores = {
            formatting: this.calculateFormattingScore(text),
            content: this.calculateContentScore(text, actionVerbs),
            skills: this.calculateSkillsScore(extractedSkills, requiredSkills),
            achievements: this.calculateAchievementsScore(text, actionVerbs)
        };
    
        // Calculate overall score
        const overallScore = this.calculateOverallScore(sectionScores);
    
        // Generate suggestions
        const suggestions = await this.generateSuggestions(text, extractedSkills, missingKeySkills, actionVerbs, sectionScores);
    
        // Get AI suggestions
        const aiSuggestions = await this.getAISuggestions(text, extractedSkills, actionVerbs);
    
        return {
            personalInfo,
            extractedSkills,
            missingKeySkills,
            sectionScores,
            overallScore,
            suggestions,
            aiSuggestions
        };
    } catch (error) {
        logger.error('Error in resume analysis:', error);
        throw error;
    }
    }

    calculateSkillsScore(extractedSkills, requiredSkills) {
        let score = 50; // Base score
        
        // Add points for each skill
        score += Math.min(extractedSkills.length * 3, 30);
        
        // Add points for matching required skills
        const matchingSkills = requiredSkills.filter(skill => 
            extractedSkills.some(extracted => 
                extracted.toLowerCase().includes(skill.toLowerCase())
            )
        );
        score += Math.min(matchingSkills.length * 2, 20);
        
        return Math.min(score, 100); // Cap at 100
    }

    calculateAchievementsScore(text, actionVerbs) {
        let score = 60; // Base score
        
        // Check for metrics and numbers
        const metrics = text.match(/\d+%|\$\d+|\d+ years|\d+\+?/g) || [];
        score += Math.min(metrics.length * 3, 20);
        
        // Check for action verbs in context
        const achievementPhrases = text.match(/\b(increased|decreased|improved|reduced|achieved|won|developed|launched|created|implemented)\b[^.]+\d+/gi) || [];
        score += Math.min(achievementPhrases.length * 4, 20);
        
        return Math.min(score, 100); // Cap at 100
    }

    async generateSuggestions(text, skills, missingSkills, actionVerbs, scores) {
        const suggestions = [];
        
        if (scores.formatting < 80) {
            if (!text.toLowerCase().includes('summary') && !text.toLowerCase().includes('objective')) {
                suggestions.push('Add a professional summary section to highlight your key achievements and career goals');
            }
            if (!/[A-Z\s]{5,}/.test(text)) {
                suggestions.push('Use consistent formatting for section headers');
            }
            if (!text.match(/[•\-\*]/g)) {
                suggestions.push('Use bullet points to make your achievements and responsibilities more readable');
            }
        }

        if (scores.content < 80) {
            if (actionVerbs.length < 8) {
                suggestions.push('Use more action verbs to describe your experiences (e.g., developed, implemented, managed)');
            }
            if (!text.match(/\d+%|\$\d+|\d+ years/g)) {
                suggestions.push('Add more quantifiable achievements with metrics (e.g., increased efficiency by 25%)');
            }
        }

        if (scores.skills < 80 && missingSkills.length > 0) {
            suggestions.push(`Consider adding these in-demand skills: ${missingSkills.slice(0, 5).join(', ')}`);
        }

        return suggestions;
    }

    async getAISuggestions(text, skills, actionVerbs) {
        try {
            // Generate personalized AI suggestions
            const context = {
                skillCount: skills.length,
                actionVerbCount: actionVerbs.length,
                hasMetrics: /\d+%|\$\d+|\d+ years/.test(text),
                hasSummary: text.toLowerCase().includes('summary') || text.toLowerCase().includes('objective')
            };

            let suggestions = [];

            if (!context.hasSummary) {
                suggestions.push('Add a compelling professional summary that highlights your key achievements and career goals.');
            }

            if (context.actionVerbCount < 10) {
                suggestions.push('Strengthen your experience descriptions with more action verbs and specific accomplishments.');
            }

            if (!context.hasMetrics) {
                suggestions.push('Include more quantifiable achievements and metrics to demonstrate your impact.');
            }

            if (context.skillCount < 8) {
                suggestions.push('Expand your skills section to showcase more relevant technical and soft skills.');
            }

            return suggestions.join(' ');

        } catch (error) {
            console.error('Error generating AI suggestions:', error);
            return 'Consider adding more quantifiable achievements and using stronger action verbs to describe your experiences.';
        }
    }
}

module.exports = new ResumeProcessor();
