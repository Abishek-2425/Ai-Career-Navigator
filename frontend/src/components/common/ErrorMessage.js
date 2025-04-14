import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Box } from '@mui/material';

/**
 * A reusable error message component for consistent error display across the application
 */
const ErrorMessage = ({
  error,
  severity = 'error',
  title,
  onClose,
  sx = {}
}) => {
  if (!error) return null;

  return (
    <Box sx={{ width: '100%', mb: 2, ...sx }}>
      <Alert 
        severity={severity}
        onClose={onClose}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {typeof error === 'string' ? error : error.message || 'An error occurred'}
      </Alert>
    </Box>
  );
};

ErrorMessage.propTypes = {
  /** Error message string or error object */
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Alert severity - 'error', 'warning', 'info', 'success' */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  /** Optional title for the alert */
  title: PropTypes.string,
  /** Optional callback for closing the alert */
  onClose: PropTypes.func,
  /** Additional styling */
  sx: PropTypes.object
};

export default React.memo(ErrorMessage);