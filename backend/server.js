require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        status: 'API is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Test MongoDB connection
async function testMongoDB() {
  try {
    // Make sure we have a valid connection
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('✗ MongoDB connection not ready');
      return false;
    }
    
    // Get the database instance
    const db = mongoose.connection.db;
    if (!db) {
      console.log('✗ MongoDB database instance not available');
      return false;
    }
    
    // Test listing collections
    await db.listCollections().toArray();
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.log(`✗ MongoDB connection error: ${error.message}`);
    return false;
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/resume', require('./routes/resume'));  

// TODO: These routes will be implemented later
// app.use('/api/recommendations', require('./routes/recommendations'));
// app.use('/api/progress', require('./routes/progress'));
// app.use('/api/trends', require('./routes/trends'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Handle 404 errors
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

// Start server function with error handling
async function startServer() {
  try {
    const server = app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
    
    // Add error handler for the server
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${config.server.port} is already in use. Please use a different port.`);
        process.exit(1);
      } else {
        console.error(`Server error: ${error.message}`);
      }
    });
    
    return server;
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    throw error;
  }
}

// Single MongoDB connection with proper sequence
mongoose.connect(config.database.uri)
  .then(async () => {
    console.log('MongoDB connected');
    // Wait a moment for the connection to be fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Test MongoDB connection
    const isDbReady = await testMongoDB();
    
    if (isDbReady) {
      // Only start the server if MongoDB is ready
      await startServer();
    } else {
      console.error('Failed to connect to MongoDB properly. Server not started.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
