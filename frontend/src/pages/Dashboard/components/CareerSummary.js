import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Grid,
    Divider
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { ProgressBar, LoadingState, ErrorMessage, SkillDisplay, StatCard } from '../../../components/common';

/**
 * Career Summary component that displays the user's career progress,
 * current skills, and career trends
 */
const CareerSummary = ({ testProgress }) => {
    const { user } = useSelector((state) => state.auth);
    const { recommendations, loading, error } = useSelector((state) => state.career);
    
    // Memoize this value to prevent recalculation on each render
    const careerProgress = useMemo(() => testProgress || 65, [testProgress]); // Example progress value or test value

    // Handle error state
    if (error) {
        return <ErrorMessage error={`Error loading career data: ${error}`} />;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Career Summary
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        {loading ? (
                            <LoadingState type="progress" />
                        ) : (
                            <ProgressBar 
                                value={careerProgress}
                                label="Career Progress"
                                ariaLabel="Career progress"
                            />
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <SkillDisplay 
                        title="Current Skills"
                        skills={user?.profile?.skills || []}
                        loading={loading}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                        Career Trends
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StatCard
                                title="Growing Skills"
                                value={recommendations?.growingSkills?.length || 0}
                                icon={<TrendingUp />}
                                loading={loading}
                                backgroundColor="success.light"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StatCard
                                title="Declining Skills"
                                value={recommendations?.decliningSkills?.length || 0}
                                icon={<TrendingDown />}
                                loading={loading}
                                backgroundColor="warning.light"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

// PropTypes for type checking
CareerSummary.propTypes = {
    /** Test value for career progress (used for testing) */
    testProgress: PropTypes.number
};

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(CareerSummary);
