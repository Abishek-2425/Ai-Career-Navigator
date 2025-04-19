import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { login } from '../../store/slices/authSlice';
import { AuthForm } from '../../components/common';
import useAuthForm from '../../hooks/useAuthForm';

const Login = () => {
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    
    // Use the custom auth form hook for login form
    const {
        formData,
        formErrors,
        handleChange,
        handleBlur,
        handleSubmit
    } = useAuthForm('login', login);

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    mt: { xs: 4, sm: 8 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <AuthForm
                    formType="login"
                    formData={formData}
                    formErrors={formErrors}
                    loading={loading}
                    error={error}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </Box>
        </Container>
    );
};

export default Login;
