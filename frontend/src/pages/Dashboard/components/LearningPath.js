import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper,
    Chip
} from '@mui/material';

const LearningPath = () => {
    const { recommendations } = useSelector((state) => state.career);
    const [activeStep, setActiveStep] = React.useState(0);

    // Example learning path data - memoized to prevent recreation on each render
    const learningPath = useMemo(() => [
        {
            label: 'Foundation Skills',
            description: 'Master the fundamental skills required for your career path',
            skills: ['JavaScript Basics', 'HTML/CSS', 'Git'],
            resources: [
                { name: 'JavaScript Course', platform: 'Udemy' },
                { name: 'Web Development Bootcamp', platform: 'Coursera' }
            ],
            completed: true
        },
        {
            label: 'Advanced Technologies',
            description: 'Learn advanced frameworks and tools',
            skills: ['React', 'Node.js', 'MongoDB'],
            resources: [
                { name: 'React Complete Guide', platform: 'Udemy' },
                { name: 'MERN Stack Course', platform: 'Pluralsight' }
            ],
            completed: false
        },
        {
            label: 'Specialization',
            description: 'Focus on your chosen specialization',
            skills: ['AWS', 'Docker', 'Kubernetes'],
            resources: [
                { name: 'AWS Certified Developer', platform: 'AWS' },
                { name: 'Docker & Kubernetes', platform: 'LinkedIn Learning' }
            ],
            completed: false
        }
    ], []);

    // Memoize these handlers to prevent recreation on each render
    const handleNext = useMemo(() => () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleBack = useMemo(() => () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Learning Path
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
                {learningPath.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>
                            <Typography variant="subtitle1">
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {step.description}
                                </Typography>

                                <Typography variant="subtitle2" gutterBottom>
                                    Skills to Learn:
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {step.skills.map((skill, idx) => (
                                        <Chip
                                            key={idx}
                                            label={skill}
                                            size="small"
                                            color={step.completed ? "success" : "default"}
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" gutterBottom>
                                    Recommended Resources:
                                </Typography>
                                {step.resources.map((resource, idx) => (
                                    <Typography 
                                        key={idx}
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                                    >
                                        • {resource.name} ({resource.platform})
                                    </Typography>
                                ))}
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === learningPath.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === learningPath.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you're finished</Typography>
                    <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(LearningPath);
