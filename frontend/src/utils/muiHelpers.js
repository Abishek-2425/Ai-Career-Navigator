/**
 * Material-UI helper utilities
 * Centralizes common MUI patterns to reduce code duplication
 */

import { alpha } from '@mui/material/styles';

// Common box shadow styles
export const boxShadows = {
  light: '0 2px 10px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 20px rgba(0, 0, 0, 0.12)',
  heavy: '0 8px 30px rgba(0, 0, 0, 0.16)'
};

// Common spacing patterns
export const spacing = {
  section: { mb: 4 },
  card: { p: 3 },
  cardHeader: { mb: 2 },
  formField: { mb: 2 }
};

// Common flex layouts
export const flexLayouts = {
  row: { display: 'flex', flexDirection: 'row' },
  column: { display: 'flex', flexDirection: 'column' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  between: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  end: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }
};

// Common card styles
export const cardStyles = {
  default: {
    borderRadius: 1,
    boxShadow: boxShadows.light,
    p: 3
  },
  hover: {
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: boxShadows.medium,
      transform: 'translateY(-4px)'
    }
  }
};

// Common gradient backgrounds
export const gradients = {
  primary: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  secondary: (theme) => `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
  success: (theme) => `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
  info: (theme) => `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.light} 90%)`
};

// Helper to create alpha colors
export const createAlphaColor = (color, value) => alpha(color, value);

// Common transition effects
export const transitions = {
  fast: 'all 0.2s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease'
};

// Common responsive breakpoint styles
export const responsiveStyles = {
  hideOnMobile: { display: { xs: 'none', sm: 'block' } },
  showOnlyOnMobile: { display: { xs: 'block', sm: 'none' } },
  fullWidthOnMobile: { width: { xs: '100%', sm: 'auto' } }
};