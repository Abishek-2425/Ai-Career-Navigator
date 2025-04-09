const Analytics = require('../models/Analytics');
const User = require('../models/User');
const CareerRecommendation = require('../models/CareerRecommendation');
const dataProcessor = require('./dataProcessor');
const logger = require('./logger');

class AnalyticsProcessor {
    async generateCareerTrends() {
        try {
            const trends = {
                stackoverflow2023: await this.processDatasetTrends('stackoverflow-2023'),
                stackoverflow2024: await this.processDatasetTrends('stackoverflow-2024'),
                naukri: await this.processDatasetTrends('naukri')
            };

            return this.aggregateTrends(trends);
        } catch (error) {
            logger.error('Error generating career trends:', error);
            throw error;
        }
    }

    async processDatasetTrends(source) {
        const recommendations = await CareerRecommendation.find({ source });
        const trends = {};

        recommendations.forEach(rec => {
            if (!trends[rec.jobTitle]) {
                trends[rec.jobTitle] = {
                    count: 0,
                    totalSalary: 0,
                    skills: {},
                    growthPoints: []
                };
            }

            const trend = trends[rec.jobTitle];
            trend.count++;
            trend.totalSalary += (rec.salaryRange.min + rec.salaryRange.max) / 2;

            rec.requiredSkills.forEach(({ skill }) => {
                trend.skills[skill] = (trend.skills[skill] || 0) + 1;
            });

            if (rec.jobGrowth) {
                trend.growthPoints.push(rec.jobGrowth.percentage);
            }
        });

        return Object.entries(trends).map(([jobTitle, data]) => ({
            jobTitle,
            count: data.count,
            averageSalary: data.totalSalary / data.count,
            growthRate: data.growthPoints.length > 0 
                ? data.growthPoints.reduce((a, b) => a + b) / data.growthPoints.length 
                : 0,
            requiredSkills: Object.entries(data.skills)
                .map(([skill, frequency]) => ({ skill, frequency }))
                .sort((a, b) => b.frequency - a.frequency),
            source
        }));
    }

    aggregateTrends(trends) {
        const aggregated = [];
        const sources = Object.keys(trends);

        sources.forEach(source => {
            trends[source].forEach(trend => {
                const existing = aggregated.find(t => t.jobTitle === trend.jobTitle);
                if (existing) {
                    existing.count += trend.count;
                    existing.averageSalary = (existing.averageSalary + trend.averageSalary) / 2;
                    existing.growthRate = (existing.growthRate + trend.growthRate) / 2;
                    
                    trend.requiredSkills.forEach(({ skill, frequency }) => {
                        const existingSkill = existing.requiredSkills.find(s => s.skill === skill);
                        if (existingSkill) {
                            existingSkill.frequency += frequency;
                        } else {
                            existing.requiredSkills.push({ skill, frequency });
                        }
                    });
                } else {
                    aggregated.push({
                        ...trend,
                        sources: [source]
                    });
                }
            });
        });

        return aggregated.sort((a, b) => b.count - a.count);
    }

    async generateUserAnalytics() {
        try {
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({
                lastActivity: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });

            const users = await User.find({}, 'profile.skills profile.interests');
            
            const skillsCount = {};
            const interestsCount = {};

            users.forEach(user => {
                if (user.profile.skills) {
                    user.profile.skills.forEach(skill => {
                        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
                    });
                }
                if (user.profile.interests) {
                    user.profile.interests.forEach(interest => {
                        interestsCount[interest] = (interestsCount[interest] || 0) + 1;
                    });
                }
            });

            return {
                totalUsers,
                activeUsers,
                userSkills: Object.entries(skillsCount)
                    .map(([skill, count]) => ({ skill, count }))
                    .sort((a, b) => b.count - a.count),
                userInterests: Object.entries(interestsCount)
                    .map(([interest, count]) => ({ interest, count }))
                    .sort((a, b) => b.count - a.count)
            };
        } catch (error) {
            logger.error('Error generating user analytics:', error);
            throw error;
        }
    }

    async updateAnalytics() {
        try {
            const [careerTrends, userAnalytics] = await Promise.all([
                this.generateCareerTrends(),
                this.generateUserAnalytics()
            ]);

            const analytics = await Analytics.findOne() || new Analytics();
            
            analytics.careerTrends.push(...careerTrends);
            analytics.userAnalytics.push(userAnalytics);
            analytics.lastUpdated = new Date();

            await analytics.save();
            return analytics;
        } catch (error) {
            logger.error('Error updating analytics:', error);
            throw error;
        }
    }

    async getLatestAnalytics() {
        try {
            const analytics = await Analytics.findOne()
                .sort({ lastUpdated: -1 })
                .limit(1);

            if (!analytics) {
                return await this.updateAnalytics();
            }

            // If analytics are older than 24 hours, update them
            if (Date.now() - analytics.lastUpdated > 24 * 60 * 60 * 1000) {
                return await this.updateAnalytics();
            }

            return analytics;
        } catch (error) {
            logger.error('Error getting latest analytics:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsProcessor();
