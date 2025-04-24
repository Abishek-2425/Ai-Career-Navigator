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
    Box
} from '@mui/material';
import { AccountCircle, Notifications, Dashboard,} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);

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
                <Box 
                    component="img" 
                    src="/map-svgrepo-com.svg" 
                    alt="Logo"
                    sx={{
                        width: 40,
                        height: 40,
                        mr: 2
                    }}
                />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1,
                        color: theme.palette.text.primary
                    }}
                >
                    N E X P L O R E
                </Typography>

                {isAuthenticated ? (
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
                        >
                            Dashboard
                        </Button>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="primary"
                        >
                            {user?.avatar ? (
                                <Avatar 
                                    src={user.avatar} 
                                    alt={user.name}
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
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
