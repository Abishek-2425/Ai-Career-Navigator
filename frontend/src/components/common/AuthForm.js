import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { validateField } from '../../utils/formValidation';
import Logo from './Logo';

/**
 * Shared authentication form component to reduce code duplication
 * between Login and Register components
 */
const AuthForm = ({
  formType = 'login', // 'login' or 'register'
  formData,
  formErrors,
  loading,
  error,
  onSubmit,
  onChange,
  onBlur
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFieldBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const isLogin = formType === 'login';
  const title = isLogin ? 'Sign in to Career Navigator' : 'Create your account';
  const buttonText = isLogin ? 'Sign In' : 'Sign Up';
  const linkText = isLogin 
    ? "Don't have an account? Sign Up"
    : 'Already have an account? Sign In';
  const linkTo = isLogin ? '/register' : '/login';

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, sm: 4 },
        width: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Logo size="medium" sx={{ mb: 2 }} />
      <Typography 
        component="h1" 
        variant="h5" 
        sx={{ mb: 3 }}
        align="center"
      >
        {title}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      {formErrors?.submit && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {formErrors.submit}
        </Alert>
      )}

      <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          {!isLogin && (
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username || ''}
                onChange={onChange}
                onBlur={handleFieldBlur}
                error={!!formErrors?.username}
                helperText={formErrors?.username}
                disabled={loading}
                InputProps={{
                  endAdornment: formData.username && !formErrors?.username && (
                    <InputAdornment position="end">
                      <CheckCircle color="success" fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={isLogin}
              value={formData.email || ''}
              onChange={onChange}
              onBlur={handleFieldBlur}
              error={!!formErrors?.email}
              helperText={formErrors?.email}
              disabled={loading}
              InputProps={{
                endAdornment: formData.email && !formErrors?.email && (
                  <InputAdornment position="end">
                    <CheckCircle color="success" fontSize="small" />
                  </InputAdornment>
                )
              }}
              aria-describedby={formErrors?.email ? "email-error" : undefined}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={formData.password || ''}
              onChange={onChange}
              onBlur={handleFieldBlur}
              error={!!formErrors?.password}
              helperText={formErrors?.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.password && !formErrors?.password && (
                      <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                    )}
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              aria-describedby={formErrors?.password ? "password-error" : undefined}
            />
          </Grid>
          
          {!isLogin && (
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={onChange}
                onBlur={handleFieldBlur}
                error={!!formErrors?.confirmPassword}
                helperText={formErrors?.confirmPassword}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.confirmPassword && !formErrors?.confirmPassword && (
                        <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                      )}
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                aria-describedby={formErrors?.confirmPassword ? "confirm-password-error" : undefined}
              />
            </Grid>
          )}
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
          aria-label={buttonText}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" aria-label="Loading" />
          ) : (
            buttonText
          )}
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Link to={linkTo} style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              {linkText}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default AuthForm;