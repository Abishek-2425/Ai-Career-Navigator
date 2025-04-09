const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('../middleware/auth');
const Resume = require('../models/Resume');
const resumeProcessor = require('../utils/resumeProcessor');
const jobMatcher = require('../utils/jobMatcher');
const dataProcessor = require('../utils/dataProcessor');
const { asyncHandler } = require('../utils/errorHandler');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create uploads directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload and analyze resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File received:', req.file);

        try {
            // Extract text and analyze resume
            const text = await resumeProcessor.extractText(req.file.path);
            console.log('Successfully extracted text from resume');

            const analysis = await resumeProcessor.analyzeResume(text);
            console.log('Resume analysis result:', {
                personalInfo: analysis.personalInfo,
                overallScore: analysis.overallScore,
                sectionScores: analysis.sectionScores
            });

            // Ensure default job roles exist
            await jobMatcher.ensureDefaultRoles();
            console.log('Ensured default job roles exist');

            // Find matching roles based on extracted skills
            const suggestedRoles = await jobMatcher.findMatchingRoles(analysis.extractedSkills);
            console.log('Successfully found matching roles:', suggestedRoles);

            // Create resume record
            const resume = new Resume({
                userId: req.user.id,
                filePath: req.file.path,
                fileName: req.file.originalname,
                fileType: req.file.mimetype === 'application/pdf' ? 'pdf' : 
                         req.file.mimetype === 'application/msword' ? 'doc' :
                         req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : 'pdf',
                analysis: {
                    ...analysis,
                    personalInfo: analysis.personalInfo || {},
                    sectionScores: analysis.sectionScores || {
                        formatting: 0,
                        content: 0,
                        skills: 0,
                        achievements: 0
                    },
                    overallScore: analysis.overallScore || 0,
                    extractedSkills: analysis.extractedSkills || [],
                    suggestions: analysis.suggestions || [],
                    aiSuggestions: analysis.aiSuggestions || ''
                },
                suggestedRoles
            });

            await resume.save();
            console.log('Saved resume to database:', {
                fileName: resume.fileName,
                personalInfo: resume.analysis.personalInfo,
                overallScore: resume.analysis.overallScore
            });
            
            // Return the processed resume data
            res.json({
                resume: {
                    fileName: resume.fileName,
                    uploadDate: resume.uploadDate,
                    analysis: resume.analysis,
                    suggestedRoles
                }
            });
        } catch (error) {
            console.error('Error in resume processing:', error);
            
            // Delete uploaded file if there was an error
            try {
                await fs.unlink(req.file.path);
                console.log('Cleaned up uploaded file after error');
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }

            res.status(500).json({ 
                error: error.message || 'Error processing resume',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }

    } catch (error) {
        console.error('Error in resume upload:', error);
        
        // Delete uploaded file if there's an error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file after failed upload:', unlinkError);
            }
        }
        
        res.status(500).json({ error: error.message });
    }
});

// Get resume analysis
router.get('/analysis', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id })
            .sort({ uploadDate: -1 });

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        // Format and send the analysis response
        res.json({
            fileName: resume.fileName,
            personalInfo: resume.analysis.personalInfo,
            analysis: {
                overallScore: resume.analysis.overallScore || 0,
                sectionScores: resume.analysis.sectionScores || {
                    formatting: 0,
                    content: 0,
                    skills: 0,
                    achievements: 0
                },
                extractedSkills: resume.analysis.extractedSkills || [],
                missingKeySkills: resume.analysis.missingKeySkills || [],
                suggestions: resume.analysis.suggestions || [],
                aiSuggestions: resume.analysis.aiSuggestions || ''
            },
            suggestedRoles: resume.suggestedRoles || []
        });

    } catch (error) {
        console.error('Error fetching resume analysis:', error);
        res.status(500).json({ error: 'Error fetching resume analysis' });
    }
});

// Get suggested job roles
router.get('/suggested-roles', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id })
            .sort({ uploadDate: -1 });

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        res.json({
            suggestedRoles: resume.suggestedRoles || []
        });

    } catch (error) {
        console.error('Error fetching suggested roles:', error);
        res.status(500).json({ error: 'Error fetching suggested roles' });
    }
});

// Update resume analysis
router.post('/reanalyze', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id })
            .sort({ uploadDate: -1 });

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        // Re-analyze the resume text
        const text = await resumeProcessor.extractText(resume.filePath, resume.fileType);
        const analysis = await resumeProcessor.analyzeResume(text);

        // Update the analysis
        resume.analysis = {
            extractedSkills: analysis.extractedSkills,
            missingKeySkills: analysis.missingKeySkills,
            overallScore: analysis.overallScore,
            sectionScores: analysis.sectionScores,
            suggestions: analysis.formatFeedback,
            aiSuggestions: analysis.aiSuggestions
        };
        resume.suggestedRoles = analysis.suggestedRoles;

        await resume.save();

        res.json({
            message: 'Resume reanalyzed successfully',
            analysis: resume.analysis,
            suggestedRoles: resume.suggestedRoles
        });

    } catch (error) {
        console.error('Error reanalyzing resume:', error);
        res.status(500).json({ error: 'Error reanalyzing resume' });
    }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete file from storage
        await fs.unlink(resume.filePath);

        // Delete from database
        await resume.remove();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use the data transformers for API responses
const { transformResumeData } = require('../utils/transformers');

// Get resume analysis
router.get('/history', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json({ success: true, data: resumes });
  } catch (error) {
    console.error('Error fetching resume history:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// After:
router.get('/history', auth, asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ userId: req.user.id });
    const transformedResumes = resumes.map(transformResumeData);
    res.json({ success: true, data: transformedResumes });
}));

// Update resume analysis
router.post('/reanalyze', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id })
            .sort({ uploadDate: -1 });

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        // Re-analyze the resume text
        const text = await resumeProcessor.extractText(resume.filePath, resume.fileType);
        const analysis = await resumeProcessor.analyzeResume(text);

        // Update the analysis
        resume.analysis = {
            extractedSkills: analysis.extractedSkills,
            missingKeySkills: analysis.missingKeySkills,
            overallScore: analysis.overallScore,
            sectionScores: analysis.sectionScores,
            suggestions: analysis.formatFeedback,
            aiSuggestions: analysis.aiSuggestions
        };
        resume.suggestedRoles = analysis.suggestedRoles;

        await resume.save();

        res.json({
            message: 'Resume reanalyzed successfully',
            analysis: resume.analysis,
            suggestedRoles: resume.suggestedRoles
        });

    } catch (error) {
        console.error('Error reanalyzing resume:', error);
        res.status(500).json({ error: 'Error reanalyzing resume' });
    }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete file from storage
        await fs.unlink(resume.filePath);

        // Delete from database
        await resume.remove();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
