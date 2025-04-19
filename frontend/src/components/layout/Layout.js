import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: theme.palette.background.default
        }}>
            <Navbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    mt: '64px', // Add margin top to account for fixed navbar
                    overflowX: 'hidden' // Prevent horizontal scrolling on mobile
                }}
                role="main"
                aria-label="Main content"
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
