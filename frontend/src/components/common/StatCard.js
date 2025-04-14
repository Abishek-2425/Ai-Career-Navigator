import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, SvgIcon } from '@mui/material';
import { LoadingState } from './index';

/**
 * A reusable component for displaying statistics and metrics consistently across the application
 * Supports icons, titles, and values with customizable styling
 */
const StatCard = ({
  title,
  value,
  icon,
  loading = false,
  backgroundColor = 'primary.light',
  textColor = 'white',
  height = 100,
  sx = {}
}) => {
  if (loading) {
    return <LoadingState type="card" height={height} />;
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: backgroundColor,
        borderRadius: 1,
        color: textColor,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && (
          <SvgIcon sx={{ mr: 1 }}>
            {icon}
          </SvgIcon>
        )}
        <Typography variant="body2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h6">
        {value}
      </Typography>
    </Box>
  );
};

StatCard.propTypes = {
  /** Title or label for the stat card */
  title: PropTypes.string.isRequired,
  /** Value to display (can be number or string) */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /** Optional icon component to display */
  icon: PropTypes.node,
  /** Whether the component is in loading state */
  loading: PropTypes.bool,
  /** Background color for the card */
  backgroundColor: PropTypes.string,
  /** Text color for the card */
  textColor: PropTypes.string,
  /** Height of the card */
  height: PropTypes.number,
  /** Additional styling */
  sx: PropTypes.object
};

export default React.memo(StatCard);