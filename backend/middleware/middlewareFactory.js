/**
 * Middleware factory
 * Creates reusable middleware functions
 */
const { AppError } = require('../utils/errorHandler');
// Removed unused config import

// Validate request body against a schema
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(message, 400));
        }
        next();
    };
};

// Check if user has required role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }
        
        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
        
        if (!roles.some(role => userRoles.includes(role))) {
            return next(new AppError('Forbidden: Insufficient permissions', 403));
        }
        
        next();
    };
};

// Rate limiting middleware with default values
const rateLimit = (maxRequests = 100, timeWindow = 60000) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        
        // Clean up old requests
        if (requests.has(ip)) {
            const userRequests = requests.get(ip).filter(time => now - time < timeWindow);
            requests.set(ip, userRequests);
            
            if (userRequests.length >= maxRequests) {
                return next(new AppError('Too many requests, please try again later', 429));
            }
            
            userRequests.push(now);
        } else {
            requests.set(ip, [now]);
        }
        
        next();
    };
};

module.exports = {
    validateRequest,
    checkRole,
    rateLimit
};