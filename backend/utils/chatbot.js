const axios = require('axios');
const logger = require('./logger');

class Chatbot {
    constructor() {
        // Using a model specifically tuned for chat/instruction
        this.API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        
        if (!apiKey) {
            console.error('HUGGINGFACE_API_KEY is not set in environment variables');
            throw new Error('Hugging Face API key is required');
        }

        this.apiKey = apiKey.trim();
        this.headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
        
        // Initialize career paths database
        this.careerPaths = {
            'frontend': {
                title: 'Frontend Developer',
                skills: [
                    'HTML5, CSS3, JavaScript (ES6+)',
                    'React, Vue.js, or Angular',
                    'TypeScript',
                    'Responsive Design',
                    'CSS Frameworks (Bootstrap, Tailwind)',
                    'Version Control (Git)',
                    'Build Tools (Webpack, Vite)',
                    'Testing (Jest, React Testing Library)'
                ],
                tools: [
                    'VS Code or WebStorm',
                    'Chrome DevTools',
                    'npm or yarn',
                    'ESLint & Prettier',
                    'Postman for API testing'
                ],
                certifications: [
                    'Meta Frontend Developer Certificate',
                    'AWS Certified Developer',
                    'Google Mobile Web Specialist'
                ]
            },
            'backend': {
                title: 'Backend Developer',
                skills: [
                    'Java, Python, Node.js, or Go',
                    'SQL and NoSQL databases',
                    'RESTful APIs',
                    'Microservices architecture',
                    'Message queues (RabbitMQ, Kafka)',
                    'Docker and Kubernetes',
                    'CI/CD pipelines'
                ],
                tools: [
                    'IntelliJ IDEA or PyCharm',
                    'Postman or Insomnia',
                    'Docker Desktop',
                    'MongoDB Compass',
                    'Redis Desktop Manager'
                ],
                certifications: [
                    'AWS Certified Developer',
                    'Oracle Certified Professional',
                    'Microsoft Certified: Azure Developer'
                ]
            },
            'fullstack': {
                title: 'Full Stack Developer',
                skills: [
                    'Frontend: HTML, CSS, JavaScript',
                    'Backend: Node.js, Python, or Java',
                    'Databases: MongoDB, PostgreSQL',
                    'API Development',
                    'DevOps basics',
                    'Cloud platforms (AWS/Azure/GCP)',
                    'Security best practices'
                ],
                tools: [
                    'VS Code or WebStorm',
                    'Git and GitHub',
                    'Docker',
                    'Postman',
                    'MongoDB Compass',
                    'AWS Console'
                ],
                certifications: [
                    'AWS Certified Full Stack Developer',
                    'MongoDB Developer',
                    'Full Stack Meta Developer Certificate'
                ]
            },
            'devops': {
                title: 'DevOps Engineer',
                skills: [
                    'Linux System Administration',
                    'Cloud Platforms (AWS/Azure/GCP)',
                    'Infrastructure as Code (Terraform)',
                    'Configuration Management (Ansible)',
                    'CI/CD (Jenkins, GitLab CI)',
                    'Monitoring (Prometheus, Grafana)',
                    'Security practices'
                ],
                tools: [
                    'Terraform',
                    'Docker and Kubernetes',
                    'Jenkins or GitLab CI',
                    'Ansible',
                    'Prometheus & Grafana',
                    'ELK Stack'
                ],
                certifications: [
                    'AWS DevOps Engineer Professional',
                    'Certified Kubernetes Administrator',
                    'Azure DevOps Engineer Expert'
                ]
            },
            'mobile': {
                title: 'Mobile Developer',
                skills: [
                    'iOS: Swift, SwiftUI',
                    'Android: Kotlin, Jetpack Compose',
                    'Cross-platform: React Native or Flutter',
                    'Mobile UI/UX principles',
                    'Local data storage',
                    'Push notifications',
                    'App performance optimization'
                ],
                tools: [
                    'Xcode for iOS',
                    'Android Studio',
                    'VS Code',
                    'Figma for design',
                    'Firebase Console',
                    'App Store Connect'
                ],
                certifications: [
                    'Apple Certified iOS Developer',
                    'Google Associate Android Developer',
                    'React Native Certification'
                ]
            },
            'ai': {
                title: 'AI/ML Engineer',
                skills: [
                    'Python, R',
                    'Machine Learning frameworks (TensorFlow, PyTorch)',
                    'Deep Learning',
                    'Natural Language Processing',
                    'Computer Vision',
                    'Data preprocessing',
                    'Model deployment'
                ],
                tools: [
                    'Jupyter Notebooks',
                    'Google Colab',
                    'TensorFlow',
                    'PyTorch',
                    'Scikit-learn',
                    'Pandas & NumPy'
                ],
                certifications: [
                    'TensorFlow Developer Certificate',
                    'AWS Machine Learning Specialty',
                    'Google Cloud Professional ML Engineer'
                ]
            },
            'data': {
                title: 'Data Engineer',
                skills: [
                    'Python, Scala, or Java',
                    'SQL and NoSQL databases',
                    'Big Data tools (Hadoop, Spark)',
                    'Data warehousing',
                    'ETL pipelines',
                    'Data modeling',
                    'Stream processing'
                ],
                tools: [
                    'Apache Spark',
                    'Apache Airflow',
                    'Snowflake',
                    'Databricks',
                    'Amazon Redshift',
                    'dbt'
                ],
                certifications: [
                    'Google Cloud Professional Data Engineer',
                    'AWS Data Analytics Specialty',
                    'Databricks Certified Associate'
                ]
            },
            'security': {
                title: 'Security Engineer',
                skills: [
                    'Network security',
                    'Application security',
                    'Cryptography',
                    'Penetration testing',
                    'Security frameworks',
                    'Incident response',
                    'Security automation'
                ],
                tools: [
                    'Wireshark',
                    'Metasploit',
                    'Nmap',
                    'Burp Suite',
                    'SIEM tools',
                    'IDS/IPS systems'
                ],
                certifications: [
                    'CompTIA Security+',
                    'Certified Ethical Hacker (CEH)',
                    'CISSP'
                ]
            }
        };
        
        console.log('Chatbot initialized with Mistral model');
    }

    async sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    createDetailedPrompt(userMessage) {
        const cleanMessage = userMessage.trim().toLowerCase();
        let careerInfo = null;

        // Check if the message matches any career path
        for (const [key, info] of Object.entries(this.careerPaths)) {
            if (cleanMessage.includes(key) || cleanMessage.includes(info.title.toLowerCase())) {
                careerInfo = info;
                break;
            }
        }

        // Format prompt based on different types of queries
        if (careerInfo) {
            return `Task: Provide detailed career guidance
Context: User wants to become a ${careerInfo.title}
Required Information:
1. Essential Skills: ${careerInfo.skills.join(', ')}
2. Key Tools: ${careerInfo.tools.join(', ')}
3. Recommended Certifications: ${careerInfo.certifications.join(', ')}

Question: ${userMessage}

Instructions:
- Explain why each skill and tool is important
- Suggest a learning order for the skills
- Provide practical next steps
- Include estimated learning time
- Mention potential career progression
`;
        }

        // For questions about specific technical concepts
        if (cleanMessage.includes('what is') || cleanMessage.includes('how to') || cleanMessage.includes('explain')) {
            return `Task: Technical concept explanation
Context: User needs to understand a technical concept
Question: ${userMessage}

Instructions:
- Provide a clear, beginner-friendly explanation
- Include real-world examples
- Mention practical applications
- Suggest related concepts to learn
`;
        }

        // For career comparison questions
        if (cleanMessage.includes('difference between') || cleanMessage.includes('compare') || cleanMessage.includes('vs')) {
            return `Task: Career path comparison
Context: User wants to compare different career paths
Question: ${userMessage}

Instructions:
- Compare key aspects: skills, tools, job prospects
- Highlight unique aspects of each path
- Discuss career growth potential
- Suggest which might be better for different types of people
`;
        }

        // For skill gap analysis
        if (cleanMessage.includes('skills') || cleanMessage.includes('learn') || cleanMessage.includes('need to know')) {
            return `Task: Skill gap analysis and learning path
Context: User wants to understand required skills
Question: ${userMessage}

Instructions:
- List essential skills in priority order
- Explain why each skill is important
- Suggest learning resources
- Provide a timeline estimate
- Include both technical and soft skills
`;
        }

        // Default career guidance prompt
        return `Task: Career guidance in technology
Context: User needs career advice
Question: ${userMessage}

Instructions:
- Provide specific, actionable advice
- Include both technical and soft skills
- Suggest concrete next steps
- Mention learning resources
- Consider current industry trends
`;
    }

    async generateResponse(message, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const detailedPrompt = this.createDetailedPrompt(message);
                logger.debug('Generated prompt for Mistral:', detailedPrompt);

                const response = await axios({
                    method: 'post',
                    url: this.API_URL,
                    headers: this.headers,
                    data: {
                        inputs: `<s>[INST] ${detailedPrompt} [/INST]`,
                        parameters: {
                            max_new_tokens: 1024,
                            temperature: 0.7,
                            top_p: 0.95,
                            return_full_text: false,
                            do_sample: true
                        }
                    }
                });

                let generatedText = Array.isArray(response.data) ? response.data[0].generated_text : response.data.generated_text;

                // If response is too short or generic, use our structured data
                if (generatedText.length < 50 || !generatedText.includes('skill')) {
                    const careerType = message.toLowerCase().includes('software engineer') ? 'fullstack' : null;
                    if (careerType && this.careerPaths[careerType]) {
                        const career = this.careerPaths[careerType];
                        generatedText = `Here are the key skills needed for a ${career.title}:

1. Technical Skills:
${career.skills.map(skill => `• ${skill}`).join('\n')}

2. Essential Tools:
${career.tools.map(tool => `• ${tool}`).join('\n')}

3. Recommended Certifications:
${career.certifications.map(cert => `• ${cert}`).join('\n')}

4. Additional Important Skills:
• Problem-solving abilities
• Communication skills
• Team collaboration
• Time management
• Continuous learning mindset`;
                    }
                }

                return this.formatResponse(generatedText);

            } catch (error) {
                logger.error('Error details:', error.response?.data);
                
                if (error.response?.status === 503) {
                    const estimatedTime = error.response?.data?.estimated_time || 20;
                    logger.info(`Model is loading. Waiting ${Math.ceil(estimatedTime)} seconds...`);
                    
                    if (attempt < retries) {
                        await this.sleep(Math.ceil(estimatedTime));
                        continue;
                    }
                }
                
                throw new Error(`Unable to process the message: ${error.message}`);
            }
        }
    }

    formatResponse(text) {
        // Split into sections
        let sections = text.split(/(?=\d+\.)/);
        
        // Process the introduction
        let introduction = sections[0];
        sections = sections.slice(1);
        
        // Format the introduction with a header
        let title = introduction.split('\n')[0]
            .replace(/^[•\s]*/, '')
            .replace(/\s+with\s+.*$/, '')  // Keep title shorter
            .toUpperCase();
            
        let intro = introduction.split('\n')
            .slice(1)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => '• ' + line.replace(/^[•\s]*|\*\*/g, '').trim())  // Remove ** and extra spaces
            .join('\n');
            
        // Add extra newlines for better spacing
        let formatted = 
`📚 ${title}

${intro}

━━━━━━━━━━━━━━━━

`;  // Add extra newline before first section
        
        // Process each numbered section
        sections = sections.map(section => {
            let lines = section.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
            
            let formattedSection = [];
            
            // Process each line in the section
            lines.forEach(line => {
                // Remove markdown and fix capitalization
                line = line.replace(/\*\*/g, '')
                          .replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                
                if (line.match(/^\d+\./)) {
                    // Main section header
                    const sectionNum = line.match(/^\d+/)[0];
                    const sectionEmoji = ['💻', '🔧', '🗄️', '🔍', '🌐'][parseInt(sectionNum) - 1] || '•';
                    const headerText = line.replace(/^\d+\.\s*/, '')
                                        .replace(/:\s*$/, '')
                                        .replace(/ing:\s*/i, '');
                    formattedSection.push(`${sectionNum}. ${sectionEmoji} ${headerText}`);
                } else if (line.toLowerCase().includes('reason')) {
                    formattedSection.push('\n→ Reason:');
                    formattedSection.push('   ' + line.replace(/^[•→\s]*(?:reason(?:ing)?:?\s*)?s?:?\s*/i, ''));
                } else if (line.toLowerCase().includes('learning resources')) {
                    formattedSection.push('\n→ Learning Resources:');
                    const resources = line.replace(/^[•→\s]*learning resources:?\s*/i, '')
                                       .split(',')
                                       .map(r => r.trim())
                                       .filter(r => r)
                                       .map(r => '   • ' + r)
                                       .join('\n');
                    formattedSection.push(resources);
                } else if (line.toLowerCase().includes('timeline') || line.toLowerCase().includes('estimated time')) {
                    formattedSection.push('\n→ Timeline:');
                    formattedSection.push('   ' + line.replace(/^[•→\s]*(?:estimated\s+)?time(?:line)?:?\s*/i, ''));
                } else if (line.trim()) {
                    formattedSection.push('   ' + line.replace(/^[•→\s]*/, ''));
                }
            });
            
            return formattedSection.join('\n');
        });
        
        // Combine all sections with proper spacing and separators
        let result = formatted + sections.join('\n\n┈┈┈┈┈┈┈┈┈┈\n\n');
        
        // Final cleanup
        return result
            .replace(/\n{4,}/g, '\n\n')  // Max 2 consecutive newlines
            .replace(/ing:\s+/g, ': ')  // Fix "Reasoning:" to "Reason:"
            .replace(/\s+d\s+/g, ' ')  // Remove single 'd' artifacts
            .replace(/([A-Z])/g, l => l.toLowerCase())  // Convert to lowercase
            .replace(/(?:^|\n)([^→\s•].)/g, (_, c) => (_ === '\n' ? '\n' : '') + c.toUpperCase())  // Capitalize first letter of sentences
            .replace(/\s+$/gm, '')  // Remove trailing spaces
            .replace(/([0-9]+\.) ?([💻🔧🗄️🔍🌐])/, '$1 $2')  // Ensure space after section numbers
            .replace(/\b[A-Z]*([a-z])/g, m => m.toLowerCase())  // Fix mid-word capitals
            .trim();
    }

    postProcessResponse(text) {
        return this.formatResponse(text);
    }

    async processMessage(message) {
        try {
            console.log('Processing message with Mistral:', message);
            const response = await this.generateResponse(message);
            return response;
        } catch (error) {
            console.error('Error in message processing:', error);
            throw error;
        }
    }
}

module.exports = new Chatbot();
