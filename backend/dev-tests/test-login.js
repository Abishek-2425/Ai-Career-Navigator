/**
 * @file test-login.js
 * @description Test script for the login API endpoint
 * 
 * This script was moved to the dev-tests/ directory as it's a development utility
 * and not part of the main application flow.
 * 
 * Purpose: Quick testing of the login API endpoint during development
 * Future use: Can be integrated into a more comprehensive test suite
 */

const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing login endpoint...');
        const response = await axios.post('http://localhost:10001/api/auth/login', {
            email: 'test@example.com',
            password: 'test123456'
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        console.error('Full error:', error);
    }
};

testLogin();