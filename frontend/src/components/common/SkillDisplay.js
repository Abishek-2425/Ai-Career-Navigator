import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import SkillChip from '../../pages/Dashboard/components/SkillChip';
import LoadingState from './LoadingState';

/**
 * A reusable component for displaying a collection of skills consistently across the application
 */
const SkillDisplay = ({
  skills = [],
  loading = false,
  emptyMessage = 'No skills added yet',
  title,
  chipSize = 'small',
  chipColor = 'primary',
  chipVariant = 'outlined',
  wrap = true,
  maxDisplay,
  sx = {}
}) => {
  // If loading, show skeleton loaders
  if (loading) {
    return (
      <Box sx={{ ...sx }}>
        {title && (
          <Typography variant="subtitle2" gutterBottom>
            {title}
          </Typography>
        )}
        <LoadingState type="chip" count={5} />
      </Box>
    );
  }

  // If no skills, show empty message
  if (!skills || skills.length === 0) {
    return (
      <Box sx={{ ...sx }}>
        {title && (
          <Typography variant="subtitle2" gutterBottom>
            {title}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  // Limit the number of skills displayed if maxDisplay is provided
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;
  const hasMore = maxDisplay && skills.length > maxDisplay;

  return (
    <Box sx={{ ...sx }}>
      {title && (
        <Typography variant="subtitle2" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: 1,
        mb: hasMore ? 1 : 0,
        overflow: wrap ? 'visible' : 'auto'
      }}>
        {displaySkills.map((skill, index) => (
          <SkillChip
            key={index}
            skill={skill}
            index={index}
            size={chipSize}
            color={chipColor}
            variant={chipVariant}
          />
        ))}
      </Box>
      {hasMore && (
        <Typography variant="caption" color="text.secondary">
          +{skills.length - maxDisplay} more
        </Typography>
      )}
    </Box>
  );
};

SkillDisplay.propTypes = {
  /** Array of skill strings to display */
  skills: PropTypes.array,
  /** Whether the component is in loading state */
  loading: PropTypes.bool,
  /** Message to display when there are no skills */
  emptyMessage: PropTypes.string,
  /** Optional title for the skills section */
  title: PropTypes.string,
  /** Size of the skill chips */
  chipSize: PropTypes.oneOf(['small', 'medium']),
  /** Color of the skill chips */
  chipColor: PropTypes.string,
  /** Variant of the skill chips */
  chipVariant: PropTypes.oneOf(['filled', 'outlined']),
  /** Whether to wrap the skills to multiple lines */
  wrap: PropTypes.bool,
  /** Maximum number of skills to display */
  maxDisplay: PropTypes.number,
  /** Additional styling */
  sx: PropTypes.object
};

export default React.memo(SkillDisplay);