import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

/**
 * A reusable skill chip component for displaying skills throughout the application
 */
const SkillChip = ({ skill, index, size = 'small', color = 'primary', variant = 'outlined' }) => {
  return (
    <Chip
      key={index}
      label={skill}
      size={size}
      color={color}
      variant={variant}
    />
  );
};

SkillChip.propTypes = {
  /** The skill name to display */
  skill: PropTypes.string.isRequired,
  /** Unique index for the skill (used as key) */
  index: PropTypes.number.isRequired,
  /** Size of the chip - 'small' or 'medium' */
  size: PropTypes.oneOf(['small', 'medium']),
  /** MUI color for the chip */
  color: PropTypes.string,
  /** Chip variant - 'filled' or 'outlined' */
  variant: PropTypes.oneOf(['filled', 'outlined']),
};

export default React.memo(SkillChip);