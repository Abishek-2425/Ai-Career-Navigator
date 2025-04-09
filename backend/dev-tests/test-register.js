/**
 * @file test-register.js
 * @description Test script for the registration API endpoint
 * 
 * This script was moved to the dev-tests/ directory as it's a development utility
 * and not part of the main application flow.
 * 
 * Purpose: Quick testing of the registration API endpoint during development
 * Future use: Can be integrated into a more comprehensive test suite
 */

const axios = require('axios');

const testRegister = async () => {
    try {
        console.log('Testing registration endpoint...');
        const response = await axios.post('http://localhost:10001/api/auth/register', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123456'
        });
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
};

testRegister();