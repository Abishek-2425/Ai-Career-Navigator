import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useMediaQuery
} from '@mui/material';
import { 
    AccountCircle, 
    Notifications, 
    Dashboard, 
    Menu as MenuIcon,
    Home,
    Person,
    PersonAdd,
    ExitToApp,
    Description
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { Logo } from '../common';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleDashboard = () => {
        navigate('/dashboard');
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                zIndex: theme.zIndex.drawer + 1
            }}
        >
            <Toolbar>
                <Logo 
                    size="medium" 
                    clickable 
                    sx={{ mr: 2 }}
                />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                >
                    AI Career Navigator
                </Typography>

                {isAuthenticated ? (
                    isMobile ? (
                        // Mobile view for authenticated users
                        <>
                            <IconButton
                                size="large"
                                edge="end"
                                color="primary"
                                aria-label="menu"
                                onClick={handleMobileMenuToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            
                            <Drawer
                                anchor="right"
                                open={mobileMenuOpen}
                                onClose={() => setMobileMenuOpen(false)}
                                sx={{
                                    '& .MuiDrawer-paper': { 
                                        width: '250px',
                                        boxSizing: 'border-box',
                                        bgcolor: 'background.paper'
                                    },
                                }}
                            >
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {user?.avatar ? (
                                        <Avatar 
                                            src={user.avatar} 
                                            alt={user.name || 'User avatar'}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    ) : (
                                        <AccountCircle sx={{ width: 40, height: 40 }} />
                                    )}
                                    <Typography variant="subtitle1">
                                        {user?.name || 'Welcome'}
                                    </Typography>
                                </Box>
                                <Divider />
                                <List>
                                    <ListItem button onClick={handleDashboard}>
                                        <ListItemIcon>
                                            <Dashboard color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItem>
                                    <ListItem button onClick={() => handleNavigation('/resume')}>
                                        <ListItemIcon>
                                            <Description color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="Resume" />
                                    </ListItem>
                                    <ListItem button onClick={handleProfile}>
                                        <ListItemIcon>
                                            <Person color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="Profile" />
                                    </ListItem>
                                </List>
                                <Divider />
                                <List>
                                    <ListItem button onClick={handleLogout}>
                                        <ListItemIcon>
                                            <ExitToApp color="error" />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        // Desktop view for authenticated users
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                size="large"
                                aria-label="show notifications"
                                color="inherit"
                            >
                                <Notifications />
                            </IconButton>
                            <Button
                                color="primary"
                                startIcon={<Dashboard />}
                                onClick={handleDashboard}
                                sx={{ mr: 2 }}
                                aria-label="Go to dashboard"
                            >
                                Dashboard
                            </Button>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="primary"
                            >
                                {user?.avatar ? (
                                    <Avatar 
                                        src={user.avatar} 
                                        alt={user.name || 'User avatar'}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <AccountCircle />
                                )}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    )
                ) : (
                    // View for non-authenticated users
                    isMobile ? (
                        <>
                            <IconButton
                                size="large"
                                edge="end"
                                color="primary"
                                aria-label="menu"
                                onClick={handleMobileMenuToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            
                            <Drawer
                                anchor="right"
                                open={mobileMenuOpen}
                                onClose={() => setMobileMenuOpen(false)}
                                sx={{
                                    '& .MuiDrawer-paper': { 
                                        width: '250px',
                                        boxSizing: 'border-box',
                                        bgcolor: 'background.paper'
                                    },
                                }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" color="primary">
                                        Menu
                                    </Typography>
                                </Box>
                                <Divider />
                                <List>
                                    <ListItem button onClick={() => handleNavigation('/login')}>
                                        <ListItemIcon>
                                            <Person color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="Login" />
                                    </ListItem>
                                    <ListItem button onClick={() => handleNavigation('/register')}>
                                        <ListItemIcon>
                                            <PersonAdd color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="Register" />
                                    </ListItem>
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <Box>
                            <Button 
                                color="primary" 
                                onClick={() => navigate('/login')}
                                aria-label="Login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </Button>
                            <Button 
                                color="primary" 
                                variant="contained"
                                onClick={() => navigate('/register')}
                                aria-label="Register"
                            >
                                Register
                            </Button>
                        </Box>
                    )
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
