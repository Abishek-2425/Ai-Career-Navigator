/**
 * @file CareerTrends.js
 * @description Career growth trends visualization component
 * 
 * This component was moved to the future/ directory as it's not currently used
 * in the application but will be valuable for the Analytics dashboard.
 * 
 * Future use: Display career market trends, growth rates, and emerging career paths
 * to help users make informed career decisions based on market data.
 */

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Tooltip,
    IconButton,
    Grid
} from '@mui/material';
import {
    TrendingUp,
    Info,
    ArrowUpward,
    ArrowDownward
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';

const CareerTrends = ({ data }) => {
    if (!data) return null;

    const getGrowthColor = (growth) => {
        if (growth >= 10) return 'success';
        if (growth >= 0) return 'warning';
        return 'error';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Career Growth Trends
                </Typography>
                <Tooltip title="Based on industry data and market analysis">
                    <IconButton size="small">
                        <Info />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Growth Trend Chart */}
            <Box sx={{ height: 300, mb: 4 }}>
                <ResponsiveLine
                    data={data.growthTrends}
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Time Period',
                        legendOffset: 40,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Growth Rate (%)',
                        legendOffset: -50,
                        legendPosition: 'middle'
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 0,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            symbolSize: 12,
                            symbolShape: 'circle'
                        }
                    ]}
                />
            </Box>

            {/* Emerging Careers */}
            <Typography variant="subtitle1" gutterBottom>
                Emerging Career Paths
            </Typography>
            <List>
                {data.emergingCareers.map((career, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 0 }
                        }}
                    >
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">
                                        {career.title}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        icon={career.growth > 0 ? <ArrowUpward /> : <ArrowDownward />}
                                        label={`${career.growth}% growth`}
                                        color={getGrowthColor(career.growth)}
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {career.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {career.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            {/* Market Insights */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Market Insights
                </Typography>
                <Grid container spacing={2}>
                    {data.marketInsights.map((insight, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {insight.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {insight.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <TrendingUp color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="caption">
                                            {insight.impact}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default CareerTrends;