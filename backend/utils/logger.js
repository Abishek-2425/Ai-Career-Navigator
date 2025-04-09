/**
 * Centralized logging service
 * Provides consistent logging across the application
 */
const winston = require('winston');
const config = require('../config');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''}`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: config.server.env === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Console transport for all environments
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        
        // File transport for production
        ...(config.server.env === 'production' ? [
            new winston.transports.File({ 
                filename: 'logs/error.log', 
                level: 'error' 
            }),
            new winston.transports.File({ 
                filename: 'logs/combined.log' 
            })
        ] : [])
    ]
});

// Helper methods for common log levels
const loggerService = {
    info: (message, meta = {}) => {
        logger.info(message, meta);
    },
    
    error: (message, error = null) => {
        if (error && error instanceof Error) {
            logger.error(`${message}: ${error.message}`, { error });
        } else {
            logger.error(message);
        }
    },
    
    warn: (message, meta = {}) => {
        logger.warn(message, meta);
    },
    
    debug: (message, meta = {}) => {
        logger.debug(message, meta);
    },
    
    // Log API requests
    logRequest: (req, res, next) => {
        const start = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
            
            if (res.statusCode >= 400) {
                logger.warn(message);
            } else {
                logger.info(message);
            }
        });
        
        next();
    }
};

module.exports = loggerService;