/**
 * Data transformation utilities
 * Provides consistent data transformation across the application
 */

// Transform user data for API responses (remove sensitive fields)
const transformUserData = (user) => {
    if (!user) return null;
    
    const { password, __v, ...userData } = user.toObject ? user.toObject() : user;
    return userData;
};

// Transform resume data for API responses
const transformResumeData = (resume) => {
    if (!resume) return null;
    
    const resumeObj = resume.toObject ? resume.toObject() : resume;
    
    // Format dates
    if (resumeObj.uploadDate) {
        resumeObj.uploadDate = resumeObj.uploadDate.toISOString();
    }
    if (resumeObj.updatedAt) {
        resumeObj.updatedAt = resumeObj.updatedAt.toISOString();
    }
    
    return resumeObj;
};

// Transform career recommendation data
const transformRecommendationData = (recommendation) => {
    if (!recommendation) return null;
    
    const recObj = recommendation.toObject ? recommendation.toObject() : recommendation;
    
    // Calculate match percentage
    if (recObj.matchedSkills && recObj.requiredSkills) {
        recObj.matchPercentage = Math.round(
            (recObj.matchedSkills.length / recObj.requiredSkills.length) * 100
        );
    }
    
    return recObj;
};

// Transform analytics data
const transformAnalyticsData = (analytics) => {
    if (!analytics) return null;
    
    const analyticsObj = analytics.toObject ? analytics.toObject() : analytics;
    
    // Format dates and ensure consistent structure
    if (analyticsObj.data) {
        analyticsObj.data = analyticsObj.data.map(item => ({
            ...item,
            date: item.date ? item.date.toISOString() : null
        }));
    }
    
    return analyticsObj;
};

module.exports = {
    transformUserData,
    transformResumeData,
    transformRecommendationData,
    transformAnalyticsData
};