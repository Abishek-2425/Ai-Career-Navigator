import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../store/slices/authSlice';
import { validateField, validators } from '../utils/formValidation';

/**
 * Custom hook for authentication forms (login and register)
 * Centralizes form state management and validation logic
 * 
 * @param {string} formType - Type of form ('login' or 'register')
 * @param {function} onSubmitAction - Redux action to dispatch on form submission
 * @returns {object} Form state, handlers, and validation functions
 */
const useAuthForm = (formType, onSubmitAction) => {
    const dispatch = useDispatch();
    const isRegisterForm = formType === 'register';
    
    // Initialize form state based on form type
    const initialFormData = isRegisterForm 
        ? { username: '', email: '', password: '', confirmPassword: '' }
        : { email: '', password: '' };
    
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    // Validation functions
    const validateUsername = (value) => {
        return validateField(value, [validators.required, validators.minLength(3)]);
    };

    const validateEmail = (value) => {
        return validateField(value, [validators.required, validators.email]);
    };

    const validatePassword = (value) => {
        return validateField(
            value, 
            [validators.required].concat(isRegisterForm ? [validators.password] : [])
        );
    };

    const validateConfirmPassword = (value) => {
        return validateField(value, [
            validators.required,
            validators.match('password', 'Password')
        ], formData);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear field error when user types
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
        
        // If password changes, validate confirmPassword again
        if (name === 'password' && formData.confirmPassword && isRegisterForm) {
            const confirmError = validateConfirmPassword(formData.confirmPassword);
            if (confirmError) {
                setFormErrors({
                    ...formErrors,
                    confirmPassword: confirmError
                });
            }
        }
        
        // Clear global error when user makes changes
        dispatch(clearError());
    };

    // Handle field blur (validate on blur)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
        
        // Validate field on blur
        switch (name) {
            case 'username':
                errorMessage = validateUsername(value);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                break;
            case 'confirmPassword':
                errorMessage = validateConfirmPassword(value);
                break;
            default:
                break;
        }
        
        if (errorMessage) {
            setFormErrors({
                ...formErrors,
                [name]: errorMessage
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create an object to store validation errors
        const newErrors = {};
        
        // Validate all fields based on form type
        if (isRegisterForm) {
            newErrors.username = validateUsername(formData.username);
            newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);
        }
        
        // Common validations for both forms
        newErrors.email = validateEmail(formData.email);
        newErrors.password = validatePassword(formData.password);
        
        setFormErrors(newErrors);
        
        // Check if there are any validation errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        // Only proceed if there are no errors
        if (!hasErrors) {
            try {
                // For register form, remove confirmPassword before submission
                const submitData = isRegisterForm 
                    ? { ...formData, confirmPassword: undefined }
                    : formData;
                    
                await dispatch(onSubmitAction(submitData)).unwrap();
            } catch (err) {
                setFormErrors({
                    ...formErrors,
                    submit: err.message || `${formType === 'login' ? 'Login' : 'Registration'} failed. Please try again.`
                });
            }
        }
    };

    return {
        formData,
        formErrors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFormData,
        setFormErrors
    };
};

export default useAuthForm;