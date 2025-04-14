import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Box } from '@mui/material';

/**
 * A reusable component for displaying loading states consistently across the application
 * Supports different types of loading skeletons based on content type
 */
const LoadingState = ({
  type = 'text',
  width,
  height,
  variant = 'rectangular',
  count = 1,
  sx = {}
}) => {
  // Generate an array of the specified count
  const items = Array(count).fill(0);

  const getSkeletonProps = () => {
    switch (type) {
      case 'text':
        return {
          variant: 'text',
          height: height || 20,
          width: width || '100%'
        };
      case 'chip':
        return {
          variant: 'rectangular',
          height: height || 32,
          width: width || 80,
          sx: { borderRadius: 16, ...sx }
        };
      case 'card':
        return {
          variant: 'rectangular',
          height: height || 100,
          width: width || '100%',
          sx: { borderRadius: 1, ...sx }
        };
      case 'circle':
        return {
          variant: 'circular',
          height: height || 40,
          width: width || 40,
          sx: { ...sx }
        };
      case 'progress':
        return {
          variant: 'rectangular',
          height: height || 10,
          width: width || '100%',
          sx: { borderRadius: 5, mb: 1, ...sx }
        };
      default:
        return {
          variant: variant,
          height: height,
          width: width,
          sx: { ...sx }
        };
    }
  };

  const skeletonProps = getSkeletonProps();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {items.map((_, index) => (
        <Skeleton
          key={index}
          {...skeletonProps}
        />
      ))}
    </Box>
  );
};

LoadingState.propTypes = {
  /** Type of skeleton to display */
  type: PropTypes.oneOf(['text', 'chip', 'card', 'circle', 'progress', 'custom']),
  /** Width of the skeleton */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Height of the skeleton */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** MUI Skeleton variant */
  variant: PropTypes.oneOf(['text', 'rectangular', 'circular']),
  /** Number of skeleton items to display */
  count: PropTypes.number,
  /** Additional styling */
  sx: PropTypes.object
};

export default React.memo(LoadingState);