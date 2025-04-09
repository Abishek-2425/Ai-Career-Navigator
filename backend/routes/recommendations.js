const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const CareerRecommendation = require('../models/CareerRecommendation');
const dataProcessor = require('../utils/dataProcessor');

// Use the middleware factory for validation and role checking
const { validateRequest, checkRole } = require('../middleware/middlewareFactory');
const { recommendationSchema } = require('../validation/schemas');

// Initialize data processor
(async () => {
    try {
        await dataProcessor.loadDatasets();
    } catch (error) {
        console.error('Failed to load datasets:', error);
    }
})();

// Get career recommendations
router.post('/generate', auth, async (req, res) => {
    try {
        const recommendations = await dataProcessor.generateRecommendations(req.user.profile);
        
        // Save recommendations to database
        const savedRecommendations = await Promise.all(
            recommendations.map(async rec => {
                const recommendation = new CareerRecommendation({
                    userId: req.user._id,
                    ...rec
                });
                return await recommendation.save();
            })
        );

        // Update user's recommendations
        req.user.recommendations = savedRecommendations.map(rec => rec._id);
        await req.user.save();

        res.json(savedRecommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's saved recommendations
router.get('/saved', auth, async (req, res) => {
    try {
        const recommendations = await CareerRecommendation.find({ userId: req.user._id })
            .sort({ dateGenerated: -1 });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get career trends
router.get('/trends', async (req, res) => {
    try {
        const trends = await dataProcessor.getCareerTrends();
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recommendation by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const recommendation = await CareerRecommendation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!recommendation) {
            return res.status(404).json({ error: 'Recommendation not found' });
        }

        res.json(recommendation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
