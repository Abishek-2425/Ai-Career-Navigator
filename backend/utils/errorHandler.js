/**
 * Centralized error handling utility
 * Provides consistent error handling across the application
 */
const logger = require('./logger');

// Standard error response format
const formatErrorResponse = (error, defaultMessage = 'An unexpected error occurred') => {
    const errorMessage = error.message || defaultMessage;
    const statusCode = error.statusCode || 500;
    
    logger.error(`Error (${statusCode}): ${errorMessage}`, error);
    
    return {
        success: false,
        error: errorMessage,
        statusCode
    };
};

// Async function wrapper to handle errors consistently
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        const errorResponse = formatErrorResponse(error);
        res.status(errorResponse.statusCode).json(errorResponse);
    });
};

// Custom error class with status code
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    formatErrorResponse,
    asyncHandler,
    AppError
};