import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Logo component for consistent branding across the application
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the logo (small, medium, large)
 * @param {boolean} [props.clickable=false] - Whether the logo should be clickable and link to home
 * @param {Object} [props.sx] - Additional MUI sx props for styling
 */
const Logo = ({ size = 'medium', clickable = false, sx = {} }) => {
  const theme = useTheme();
  
  // Define size variants
  const sizeMap = {
    small: { width: 30, height: 30 },
    medium: { width: 40, height: 40 },
    large: { width: 60, height: 60 }
  };
  
  const dimensions = sizeMap[size] || sizeMap.medium;
  
  const logoImage = (
    <Box 
      component="img" 
      src="/map-svgrepo-com.svg" 
      alt="AI Career Navigator Logo"
      sx={{
        ...dimensions,
        transition: 'transform 0.2s',
        ...(clickable && {
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }),
        ...sx
      }}
      aria-hidden={!clickable} // Only treat as decorative when not clickable
    />
  );
  
  // If clickable, wrap in Link component
  if (clickable) {
    return (
      <Link to="/" aria-label="Go to home page">
        {logoImage}
      </Link>
    );
  }
  
  return logoImage;
};

export default Logo;