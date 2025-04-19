import { useState } from 'react';
import { validateForm } from '../utils/formValidation';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for form fields
 * @param {Function} onSubmit - Function to call on valid form submission
 */
const useForm = (initialValues = {}, validationRules = {}, onSubmit = () => {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
        
        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationResult = validateForm(values, validationRules);
        setErrors(validationResult.errors || {});
        
        if (validationResult.isValid) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
                // Handle submission error if needed
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setValues
    };
};

export default useForm;