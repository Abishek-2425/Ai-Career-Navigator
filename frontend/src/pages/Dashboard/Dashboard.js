import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    LinearProgress,
    Divider,
    Container,
    CircularProgress,
    useTheme,
    alpha,
    Tooltip,
    Stack,
    Avatar,
    Button
} from '@mui/material';
import {
    TrendingUp,
    Message,
    Description,
    School,
    Star,
    Business,
    AccessTime,
    CheckCircle,
    EmojiEmotions,
    Psychology,
    Lightbulb,
    Coffee,
    LocalCafe,
    Pets,
    Lock,
    ArrowForward
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Memoized SkillNode component to prevent unnecessary re-renders in the skill tree
const SkillNode = React.memo(({ skill, level = 0 }) => {
    const theme = useTheme();
    const isUnlocked = skill.unlocked;
    
    // Memoize the tooltip content to prevent recreation on each render
    const tooltipContent = useMemo(() => (
        <Box>
            <Typography variant="subtitle2">{skill.name}</Typography>
            <Typography variant="caption" display="block">
                Level: {skill.level}/{skill.maxLevel}
            </Typography>
            {skill.description && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    {skill.description}
                </Typography>
            )}
        </Box>
    ), [skill.name, skill.level, skill.maxLevel, skill.description]);
    
    return (
        <Box sx={{ 
            position: 'relative',
            '&::before': level > 0 ? {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: -20,
                width: 20,
                height: 2,
                bgcolor: isUnlocked ? theme.palette.primary.main : alpha(theme.palette.text.disabled, 0.3),
            } : {}
        }}>
            <Tooltip title={tooltipContent}>
                <Paper
                    elevation={isUnlocked ? 2 : 0}
                    sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        bgcolor: isUnlocked 
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.action.disabledBackground, 0.5),
                        border: '2px solid',
                        borderColor: isUnlocked 
                            ? theme.palette.primary.main 
                            : alpha(theme.palette.text.disabled, 0.3),
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            bgcolor: isUnlocked 
                                ? alpha(theme.palette.primary.main, 0.15)
                                : alpha(theme.palette.action.disabledBackground, 0.6),
                        }
                    }}
                >
                    {isUnlocked ? (
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                color: theme.palette.primary.main
                            }}
                        >
                            {skill.icon}
                        </Avatar>
                    ) : (
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette.text.disabled, 0.1),
                                color: theme.palette.text.disabled
                            }}
                        >
                            <Lock fontSize="small" />
                        </Avatar>
                    )}
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: isUnlocked ? 'text.primary' : 'text.disabled',
                            fontWeight: isUnlocked ? 600 : 400
                        }}
                    >
                        {skill.name}
                    </Typography>
                    {skill.level > 0 && (
                        <Chip
                            label={`Lvl ${skill.level}`}
                            size="small"
                            sx={{
                                ml: 'auto',
                                bgcolor: isUnlocked 
                                    ? alpha(theme.palette.primary.main, 0.2)
                                    : alpha(theme.palette.text.disabled, 0.1),
                                color: isUnlocked 
                                    ? theme.palette.primary.main
                                    : theme.palette.text.disabled,
                                height: 20,
                                '& .MuiChip-label': {
                                    px: 1,
                                    fontSize: '0.625rem',
                                    fontWeight: 600
                                }
                            }}
                        />
                    )}
                </Paper>
            </Tooltip>
            {skill.children?.length > 0 && (
                <Box sx={{ pl: 4 }}>
                    {skill.children.map((child, index) => (
                        <SkillNode key={child.id} skill={child} level={level + 1} />
                    ))}
                </Box>
            )}
        </Box>
    );
});

// Memoized CareerCompanion component to prevent unnecessary re-renders
const CareerCompanion = React.memo(({ userName }) => {
    const theme = useTheme();
    const [mood, setMood] = useState('happy');
    const [message, setMessage] = useState('Ready to achieve great things today!');
    const [energy, setEnergy] = useState(80);

    // Memoize the emoji objects to prevent recreation on each render
    const moodEmojis = useMemo(() => ({
        happy: <EmojiEmotions sx={{ fontSize: 64, color: '#FFD700' }} />,
        thinking: <Psychology sx={{ fontSize: 64, color: theme.palette.primary.main }} />,
        inspired: <Lightbulb sx={{ fontSize: 64, color: '#FFA500' }} />,
        needsCoffee: <Coffee sx={{ fontSize: 64, color: '#8B4513' }} />
    }), [theme.palette.primary.main]);

    const getPersonalizedMessage = useCallback((mood) => {
        const messages = {
            happy: `Keep up the great work, ${userName}!`,
            thinking: `Hmm... what should we focus on next, ${userName}?`,
            inspired: `I have some great ideas for your growth, ${userName}!`,
            needsCoffee: `Time for a productive break, ${userName}?`
        };
        return messages[mood];
    }, [userName]);

    const updateEnergy = useCallback(() => {
        // Simulate energy changes based on time of day
        const hour = new Date().getHours();
        if (hour < 6) setEnergy(30); // Early morning
        else if (hour < 12) setEnergy(90); // Morning
        else if (hour < 15) setEnergy(70); // After lunch
        else if (hour < 19) setEnergy(60); // Afternoon
        else setEnergy(40); // Evening
    }, []);

    useEffect(() => {
        updateEnergy();
        const interval = setInterval(updateEnergy, 60000); // Update energy every minute
        return () => clearInterval(interval);
    }, [updateEnergy]);

    useEffect(() => {
        const interval = setInterval(() => {
            const moods = ['happy', 'thinking', 'inspired', 'needsCoffee'];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            setMood(randomMood);
            setMessage(getPersonalizedMessage(randomMood));
        }, 10000);

        return () => clearInterval(interval);
    }, [getPersonalizedMessage]);

    // Fixed HTML nesting issues by ensuring proper component hierarchy
    return (
        <Paper sx={{ 
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: theme.palette.primary.main,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} ${energy}%, ${alpha(theme.palette.primary.main, 0.2)} ${energy}%)`
            }} />
            
            <Box sx={{ 
                mb: 2,
                animation: mood === 'happy' ? 'bounce 1s infinite' : 'none',
                '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                }
            }}>
                {moodEmojis[mood]}
            </Box>

            <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}>
                Hi, {userName}! 👋
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ 
                mb: 3,
                textAlign: 'center',
                fontStyle: 'italic'
            }}>
                {message}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip 
                    icon={<LocalCafe />}
                    label={`Energy: ${energy}%`}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
                <Chip 
                    icon={<Pets />}
                    label="Level 5"
                    color="secondary"
                    variant="outlined"
                    size="small"
                />
            </Stack>

            <Box sx={{ width: '100%', mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
                    Daily Tip
                </Typography>
                {/* Using Box instead of Paper to avoid nesting issues */}
                <Box sx={{ 
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        "Take small steps every day. They add up to big achievements!"
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
});

const Dashboard = () => {
    const user = useSelector(state => state.auth.user);
    const theme = useTheme();
    
    // Memoize these data arrays to prevent recreation on each render
    const featuredActions = useMemo(() => [
        {
            title: 'Career Trends',
            icon: <TrendingUp />,
            description: 'Analyze industry trends and salary insights',
            link: '/career-trends',
            stats: {
                trendsAnalyzed: 124,
                industriesTracked: 8,
                lastUpdated: '2 hours ago'
            }
        },
        {
            title: 'AI Chat Assistant',
            icon: <Message />,
            description: 'Get personalized career guidance',
            link: '/chatbot',
            stats: {
                chatsCompleted: 15,
                questionsAnswered: 45,
                avgResponseTime: '2 min'
            }
        },
        {
            title: 'Resume Feedback',
            icon: <Description />,
            description: 'Get AI-powered resume analysis',
            link: '/resume-feedback',
            stats: {
                resumeScore: 85,
                improvements: 12,
                lastAnalysis: '1 day ago'
            }
        },
        {
            title: 'Learning Path',
            icon: <School />,
            description: 'Track your learning progress',
            link: '/learning-path',
            stats: {
                coursesCompleted: 4,
                hoursLearned: 28,
                nextMilestone: '5 courses'
            }
        }
    ], []);

    const recentActivities = useMemo(() => [
        {
            type: 'course',
            title: 'Completed Python Basics',
            timestamp: '2 hours ago',
            icon: <School color="primary" />,
            color: 'primary'
        },
        {
            type: 'resume',
            title: 'Resume Analysis Complete',
            timestamp: '1 day ago',
            icon: <Description color="secondary" />,
            color: 'secondary'
        },
        {
            type: 'skill',
            title: 'New Skill: React.js',
            timestamp: '2 days ago',
            icon: <Star color="warning" />,
            color: 'warning'
        },
        {
            type: 'job',
            title: 'Applied to Senior Developer',
            timestamp: '3 days ago',
            icon: <Business color="info" />,
            color: 'info'
        }
    ], []);

    const recommendedSkills = useMemo(() => [
        {
            name: 'React.js',
            category: 'Technical',
            relevance: 95,
            progress: 60
        },
        {
            name: 'Node.js',
            category: 'Technical',
            relevance: 90,
            progress: 40
        },
        {
            name: 'Data Analysis',
            category: 'Analytics',
            relevance: 85,
            progress: 30
        },
        {
            name: 'Project Management',
            category: 'Soft Skills',
            relevance: 80,
            progress: 70
        }
    ], []);

    const jobMatches = useMemo(() => [
        {
            title: 'Senior Full Stack Developer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            matchPercentage: 95,
            isNew: true,
            postedDate: '2 days ago',
            skills: ['React.js', 'Node.js', 'MongoDB']
        },
        {
            title: 'Lead Software Engineer',
            company: 'Innovation Labs',
            location: 'New York, NY',
            matchPercentage: 90,
            isNew: true,
            postedDate: '3 days ago',
            skills: ['Java', 'Spring Boot', 'AWS']
        },
        {
            title: 'Frontend Developer',
            company: 'Digital Solutions',
            location: 'Remote',
            matchPercentage: 85,
            isNew: false,
            postedDate: '5 days ago',
            skills: ['React.js', 'Angular', 'Vue.js']
        }
    ], []);

    // Add loading state check
    if (!user) {
        return (
            <Container 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '60vh'
                }}
            >
                <CircularProgress />
            </Container>
        );
    }
    
    return (
        <Container 
            sx={{ 
                mt: { xs: 8, sm: 9 }, 
                mb: 4,
                pt: 3, 
                position: 'relative',
                zIndex: 0,
                '& .MuiPaper-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                    }
                }
            }}
        >
            {/* Welcome Section with Profile Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper 
                        sx={{ 
                            p: 4, 
                            height: '100%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
                                zIndex: 1
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '30%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                                zIndex: 1
                            }
                        }}
                        elevation={4}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 4,
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <Avatar 
                                sx={{ 
                                    width: 100, 
                                    height: 100,
                                    border: '4px solid rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                    background: 'linear-gradient(45deg, #fff 30%, #f5f5f5 90%)',
                                    color: theme.palette.primary.main,
                                    fontSize: '2.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" component="h1" sx={{ 
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    mb: 1,
                                    letterSpacing: '-0.5px'
                                }}>
                                    Welcome back, {user?.name || 'User'}!
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    opacity: 0.95,
                                    fontWeight: 500,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    letterSpacing: '0.5px'
                                }}>
                                    Let's continue your journey to success
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Stats Section */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 4,
                        height: '100%',
                        background: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <TrendingUp sx={{ color: theme.palette.primary.main }} />
                                Quick Stats
                            </Typography>
                            <Chip 
                                label="Today" 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        
                        <Grid container spacing={2}>
                            {[
                                { 
                                    label: 'Courses Completed', 
                                    value: '12', 
                                    icon: <CheckCircle sx={{ fontSize: 28 }} color="success" />,
                                    trend: '+2 this week',
                                    color: theme.palette.success.main
                                },
                                { 
                                    label: 'Hours Learning', 
                                    value: '48', 
                                    icon: <AccessTime sx={{ fontSize: 28 }} color="primary" />,
                                    trend: '+5 hrs today',
                                    color: theme.palette.primary.main
                                },
                                { 
                                    label: 'Skills Gained', 
                                    value: '8', 
                                    icon: <Psychology sx={{ fontSize: 28 }} color="secondary" />,
                                    trend: '+1 new skill',
                                    color: theme.palette.secondary.main
                                },
                                { 
                                    label: 'Current Streak', 
                                    value: '5', 
                                    icon: <LocalCafe sx={{ fontSize: 28 }} color="warning" />,
                                    trend: 'days',
                                    color: theme.palette.warning.main
                                }
                            ].map((stat, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box sx={{ 
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(stat.color, 0.08),
                                        border: 1,
                                        borderColor: alpha(stat.color, 0.2),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`,
                                            bgcolor: alpha(stat.color, 0.12)
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            {stat.icon}
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h4" sx={{ 
                                            fontWeight: 700,
                                            color: stat.color,
                                            mb: 0.5
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" sx={{ 
                                            color: alpha(theme.palette.text.primary, 0.7),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}>
                                            <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                            {stat.trend}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Featured Actions Section */}
            <Typography variant="h5" sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: 'text.primary',
                position: 'relative',
                pl: 2,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2
                }
            }}>
                Featured Actions
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {featuredActions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper sx={{ 
                            p: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            bgcolor: theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.background.paper, 0.9)
                        }}>
                            <Box sx={{ 
                                p: 3,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {action.icon}
                                    </Avatar>
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1
                                }}>
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: theme.palette.text.secondary,
                                    mb: 2,
                                    flex: 1
                                }}>
                                    {action.description}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ 
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Button 
                                    component={Link}
                                    to={action.link}
                                    endIcon={<ArrowForward />}
                                    fullWidth
                                    sx={{ 
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2)
                                        }
                                    }}
                                >
                                    Continue
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activities and Career Tools Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ 
                        mb: 3, 
                        fontWeight: 700,
                        color: 'text.primary',
                        position: 'relative',
                        pl: 2,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 4,
                            height: '60%',
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 2
                        }
                    }}>
                        Recent Activities
                    </Typography>
                    <Paper sx={{ p: 3 }}>
                        <List sx={{ 
                            '& .MuiListItem-root': { 
                                px: 0,
                                '&:hover': {
                                    bgcolor: 'transparent'
                                }
                            }
                        }}>
                            {recentActivities.map((activity, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        '&::before': index !== recentActivities.length - 1 ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 20,
                                            top: 40,
                                            bottom: -20,
                                            width: 2,
                                            bgcolor: 'divider'
                                        } : {}
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 42 }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: `${activity.color}.light`,
                                                color: `${activity.color}.main`
                                            }}
                                        >
                                            {activity.icon}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {activity.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {activity.timestamp}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Career Tools Section */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ 
                                mb: 3, 
                                fontWeight: 700,
                                color: 'text.primary',
                                position: 'relative',
                                pl: 2,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 4,
                                    height: '60%',
                                    bgcolor: theme.palette.primary.main,
                                    borderRadius: 2
                                }
                            }}>
                                Career Companion
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CareerCompanion userName={user?.name || 'there'} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Activity and Skills Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Recommended Skills</Typography>
                            <Button endIcon={<ArrowForward />} size="small">View All</Button>
                        </Box>
                        <List>
                            {recommendedSkills.map((skill, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                                        {skill.name}
                                                    </Typography>
                                                    <Chip
                                                        label={`${skill.relevance}% Match`}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {skill.category}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {skill.progress}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={skill.progress}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < recommendedSkills.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Job Matches</Typography>
                            <Button endIcon={<ArrowForward />} size="small">View All</Button>
                        </Box>
                        <List>
                            {jobMatches.map((job, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {job.title}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            {job.company}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={`${job.matchPercentage}% Match`}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            bgcolor: `rgba(25, 118, 210, ${job.matchPercentage / 100})`
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.location}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.postedDate}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {job.skills.map((skill, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={skill}
                                                                size="small"
                                                                sx={{ 
                                                                    bgcolor: 'background.default',
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < jobMatches.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
