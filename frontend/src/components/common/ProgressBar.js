import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, LinearProgress, useTheme } from '@mui/material';

/**
 * A reusable progress bar component with consistent styling
 * Used across the application for showing various progress indicators
 */
const ProgressBar = ({
  value,
  label,
  showPercentage = true,
  height = 10,
  color = 'primary',
  labelPosition = 'top',
  labelVariant = 'body2',
  labelColor = 'text.secondary',
  ariaLabel = 'progress'
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      {label && labelPosition === 'top' && (
        <Typography variant={labelVariant} color={labelColor} gutterBottom>
          {label}
        </Typography>
      )}

      <LinearProgress
        variant="determinate"
        value={value}
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2
          }
        }}
        color={color}
      />

      {showPercentage && (
        <Typography
          variant={labelVariant}
          color={labelColor}
          sx={{ mt: 1, textAlign: 'right' }}
        >
          {`${Math.round(value)}% Complete`}
        </Typography>
      )}

      {label && labelPosition === 'bottom' && (
        <Typography variant={labelVariant} color={labelColor} sx={{ mt: 1 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

ProgressBar.propTypes = {
  /** Progress value (0-100) */
  value: PropTypes.number.isRequired,
  /** Optional label for the progress bar */
  label: PropTypes.string,
  /** Whether to show percentage text */
  showPercentage: PropTypes.bool,
  /** Height of the progress bar */
  height: PropTypes.number,
  /** MUI color for the progress bar */
  color: PropTypes.string,
  /** Position of the label - 'top' or 'bottom' */
  labelPosition: PropTypes.oneOf(['top', 'bottom']),
  /** MUI Typography variant for the label */
  labelVariant: PropTypes.string,
  /** Color for the label text */
  labelColor: PropTypes.string,
  /** Aria label for accessibility */
  ariaLabel: PropTypes.string
};

export default React.memo(ProgressBar);