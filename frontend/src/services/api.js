import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    getProfile: () => api.get('/auth/profile')
};

// Resume services
const resumeService = {
    uploadResume: (formData) => {
        return api.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getResumeHistory: () => api.get('/resume/history'),
    getResumeAnalysis: (resumeId) => api.get(`/resume/analysis/${resumeId}`),
    deleteResume: (resumeId) => api.delete(`/resume/${resumeId}`)
};

// Career recommendation services
const careerService = {
    getRecommendations: () => api.get('/recommendations'),
    getSuggestedRoles: () => api.get('/recommendations/roles'),
    getSkillGapAnalysis: (roleId) => api.get(`/recommendations/skill-gap/${roleId}`),
    savePreferredPath: (pathData) => api.post('/recommendations/save-path', pathData)
};

// Analytics services
const analyticsService = {
    getUserAnalytics: () => api.get('/analytics/user'),
    getCareerTrends: () => api.get('/analytics/trends'),
    getSkillDemand: () => api.get('/analytics/skill-demand')
};

// Learning services
const learningService = {
    getLearningResources: (filters) => api.get('/learning/resources', { params: filters }),
    bookmarkResource: (resourceId) => api.post(`/learning/bookmark/${resourceId}`),
    getBookmarkedResources: () => api.get('/learning/bookmarks'),
    trackProgress: (progressData) => api.post('/learning/track-progress', progressData)
};

export {
    api as default,
    authService,
    resumeService,
    careerService,
    analyticsService,
    learningService
};
