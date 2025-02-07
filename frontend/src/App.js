import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';

// Theme
import theme from './theme/theme';

// Layout components
import Navbar from './components/layout/Navbar';

// Page components
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChatBot from './pages/Chat/ChatBot';
import ResumeFeedback from './pages/Resume/ResumeFeedback';
import CareerTrends from './pages/Analytics/CareerTrends';
import Profile from './pages/Profile/Profile';
import LearningPath from './pages/Learning/LearningPath';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

// Store
import { getCurrentUser } from './store/slices/authSlice';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const restoreUserData = () => {
      try {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          console.log('Restoring user data from storage');
          dispatch({ 
            type: 'auth/restoreUser', 
            payload: { 
              user: JSON.parse(userData), 
              token 
            }
          });
        }
      } catch (error) {
        console.error('Error restoring user data:', error);
      }
    };

    restoreUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ChatProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!loading && isAuthenticated && <Navbar />}
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Redirect root to login or dashboard based on auth status */}
                <Route 
                  path="/" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Navigate to="/login" replace />
                  } 
                />

                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Register />
                  } 
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/career-trends"
                  element={
                    <ProtectedRoute>
                      <CareerTrends />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <ProtectedRoute>
                      <ChatBot />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume-feedback"
                  element={
                    <ProtectedRoute>
                      <ResumeFeedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learning-path"
                  element={
                    <ProtectedRoute>
                      <LearningPath />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route - redirect to login or dashboard */}
                <Route 
                  path="*" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Navigate to="/login" replace />
                  } 
                />
              </Routes>
            </Box>
          </Box>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
