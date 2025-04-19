/**
 * Form validation utilities
 * Centralizes validation logic to reduce code duplication across components
 * 
 * This is a consolidated validation utility that combines functionality from
 * both formValidation.js and validation.js to eliminate redundancy.
 */

// Common validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
};

// Basic validators
export const validators = {
  required: (value) => ({
    isValid: value !== undefined && value !== null && value.toString().trim() !== '',
    message: 'This field is required'
  }),
  
  email: (value) => ({
    isValid: !value || patterns.email.test(value),
    message: 'Please enter a valid email address'
  }),
  
  password: (value) => ({
    isValid: !value || patterns.password.test(value),
    message: 'Password must be at least 8 characters with at least one letter and one number'
  }),
  
  minLength: (min) => (value) => ({
    isValid: !value || value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  
  maxLength: (max) => (value) => ({
    isValid: !value || value.length <= max,
    message: `Must be no more than ${max} characters`
  }),
  
  url: (value) => ({
    isValid: !value || patterns.url.test(value),
    message: 'Please enter a valid URL'
  }),
  
  phone: (value) => ({
    isValid: !value || patterns.phone.test(value),
    message: 'Please enter a valid phone number'
  }),
  
  match: (field, fieldName) => (value, formValues) => ({
    isValid: value === formValues[field],
    message: `Must match ${fieldName || field}`
  })
};

// Validate a single field with multiple validators
export const validateField = (value, fieldValidators, formValues = {}) => {
  for (const validator of fieldValidators) {
    const result = typeof validator === 'function' 
      ? validator(value, formValues)
      : validator;
      
    if (!result.isValid) {
      return result.message;
    }
  }
  return '';
};

// Validate an entire form
export const validateForm = (values, validationSchema) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationSchema).forEach(field => {
    const fieldValidators = validationSchema[field];
    const errorMessage = validateField(values[field], fieldValidators, values);
    
    if (errorMessage) {
      errors[field] = errorMessage;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Create a validation schema with common patterns
export const createValidationSchema = (fields) => {
  const schema = {};
  
  Object.keys(fields).forEach(field => {
    const fieldConfig = fields[field];
    schema[field] = [];
    
    if (fieldConfig.required) {
      schema[field].push(validators.required);
    }
    
    if (fieldConfig.type === 'email') {
      schema[field].push(validators.email);
    }
    
    if (fieldConfig.type === 'password') {
      schema[field].push(validators.password);
    }
    
    if (fieldConfig.minLength) {
      schema[field].push(validators.minLength(fieldConfig.minLength));
    }
    
    if (fieldConfig.maxLength) {
      schema[field].push(validators.maxLength(fieldConfig.maxLength));
    }
    
    if (fieldConfig.match) {
      schema[field].push(validators.match(fieldConfig.match, fieldConfig.matchFieldName));
    }
    
    if (fieldConfig.custom) {
      schema[field].push(fieldConfig.custom);
    }
  });
  
  return schema;
};