import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Rating,
    Stack
} from '@mui/material';
import { Work, LocationOn, AttachMoney } from '@mui/icons-material';

const RecommendedJobs = () => {
    const { recommendations } = useSelector((state) => state.career);

    // Example jobs data - memoized to prevent recreation on each render
    const jobs = useMemo(() => [
        {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            matchScore: 92,
            salary: '$120k - $150k',
            skills: ['React', 'Node.js', 'AWS'],
            source: 'stackoverflow-2024'
        },
        {
            title: 'Data Scientist',
            company: 'AI Solutions',
            location: 'New York, NY',
            matchScore: 85,
            salary: '$100k - $130k',
            skills: ['Python', 'Machine Learning', 'SQL'],
            source: 'naukri'
        },
        {
            title: 'Product Manager',
            company: 'Innovation Inc',
            location: 'Remote',
            matchScore: 78,
            salary: '$110k - $140k',
            skills: ['Product Strategy', 'Agile', 'Analytics'],
            source: 'stackoverflow-2023'
        }
    ], []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Recommended Jobs
                </Typography>
                <Button variant="outlined" size="small">
                    View All
                </Button>
            </Box>

            <Grid container spacing={2}>
                {jobs.map((job, index) => (
                    <Grid item xs={12} key={index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h6" gutterBottom>
                                            {job.title}
                                        </Typography>
                                        
                                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Work sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {job.company}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {job.location}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AttachMoney sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {job.salary}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box sx={{ mb: 2 }}>
                                            {job.skills.map((skill, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={skill}
                                                    size="small"
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Match Score
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Typography 
                                                    variant="h5" 
                                                    color="primary" 
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {job.matchScore}%
                                                </Typography>
                                                <Rating 
                                                    value={job.matchScore / 20} 
                                                    precision={0.5} 
                                                    readOnly 
                                                    sx={{ ml: 1 }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Source: {job.source}
                                            </Typography>
                                        </Box>
                                        <Button variant="contained" size="small" sx={{ mt: 2 }}>
                                            View Details
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(RecommendedJobs);
