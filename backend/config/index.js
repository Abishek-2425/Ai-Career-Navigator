/**
 * Centralized configuration module
 * Manages all environment variables and configuration settings
 */
require('dotenv').config();

const config = {
    // Server configuration
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
    },
    
    // Database configuration
    database: {
        uri: process.env.MONGODB_URI,
        options: {
            // Remove deprecated options
        }
    },
    
    // Authentication configuration
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    },
    
    // External API keys
    apis: {
        huggingFace: process.env.HUGGINGFACE_API_KEY,
    },
    
    // File upload configuration
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    }
};

// Validate required configuration
const validateConfig = () => {
    const requiredVars = [
        'database.uri',
        'auth.jwtSecret',
        'apis.huggingFace'
    ];
    
    const missingVars = requiredVars.filter(path => {
        const keys = path.split('.');
        let current = config;
        
        for (const key of keys) {
            if (current[key] === undefined) return true;
            current = current[key];
        }
        
        return !current;
    });
    
    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
};

// Only validate in production
if (config.server.env === 'production') {
    validateConfig();
}

module.exports = config;