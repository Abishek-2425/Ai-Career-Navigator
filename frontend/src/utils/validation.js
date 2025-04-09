/**
 * Form validation utility
 * Provides reusable validation functions for forms
 */

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 letter and 1 number)
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

// Required field validation
const isRequired = (value) => {
    return value !== undefined && value !== null && value.trim() !== '';
};

// Min length validation
const minLength = (value, min) => {
    return value && value.length >= min;
};

// Max length validation
const maxLength = (value, max) => {
    return value && value.length <= max;
};

// Form field validation with multiple rules
const validateField = (value, rules) => {
    for (const rule of rules) {
        switch (rule.type) {
            case 'required':
                if (!isRequired(value)) return rule.message || 'This field is required';
                break;
            case 'email':
                if (!isValidEmail(value)) return rule.message || 'Invalid email format';
                break;
            case 'password':
                if (!isValidPassword(value)) return rule.message || 'Password must be at least 8 characters with letters and numbers';
                break;
            case 'minLength':
                if (!minLength(value, rule.value)) return rule.message || `Minimum ${rule.value} characters required`;
                break;
            case 'maxLength':
                if (!maxLength(value, rule.value)) return rule.message || `Maximum ${rule.value} characters allowed`;
                break;
            default:
                break;
        }
    }
    return '';
};

// Validate entire form
const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
        const error = validateField(formData[field], validationRules[field]);
        if (error) {
            errors[field] = error;
            isValid = false;
        }
    });
    
    return { isValid, errors };
};

export {
    isValidEmail,
    isValidPassword,
    isRequired,
    minLength,
    maxLength,
    validateField,
    validateForm
};