import { createTheme } from '@mui/material/styles';

// Define color palette
const colors = {
    primary: {
        main: '#3f51b5',
        light: '#757de8',
        dark: '#002984',
        contrastText: '#ffffff'
    },
    secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
        contrastText: '#ffffff'
    },
    success: {
        main: '#4caf50',
        light: '#80e27e',
        dark: '#087f23'
    },
    warning: {
        main: '#ff9800',
        light: '#ffc947',
        dark: '#c66900'
    },
    error: {
        main: '#f44336',
        light: '#ff7961',
        dark: '#ba000d'
    },
    background: {
        default: '#f5f5f5',
        paper: '#ffffff'
    }
};

// Create theme with consistent typography, spacing, and components
const theme = createTheme({
    palette: colors,
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500
        }
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6
                }
            }
        }
    }
});

export default theme;