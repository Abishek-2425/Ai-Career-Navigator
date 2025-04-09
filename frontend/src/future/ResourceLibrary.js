/**
 * @file ResourceLibrary.js
 * @description Learning resources library component
 * 
 * This component was moved to the future/ directory as it's not currently used
 * in the application but will be essential for the Learning and Skill Gap Analysis features.
 * 
 * Future use: Display, search, and filter learning resources to help users
 * bridge skill gaps identified in their career path analysis.
 */

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Divider,
    Menu,
    MenuItem,
    Button
} from '@mui/material';
import {
    Search,
    FilterList,
    BookmarkBorder,
    Bookmark,
    Description,
    VideoLibrary,
    Link as LinkIcon,
    MoreVert,
    Download,
    Share,
    OpenInNew
} from '@mui/icons-material';

const ResourceLibrary = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);

    if (!data) return null;

    const handleMenuOpen = (event, resource) => {
        setAnchorEl(event.currentTarget);
        setSelectedResource(resource);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedResource(null);
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'document':
                return <Description />;
            case 'video':
                return <VideoLibrary />;
            case 'link':
                return <LinkIcon />;
            default:
                return <Description />;
        }
    };

    const filteredResources = data.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || resource.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <Box>
            {/* Search and Filter */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 2 }}
                />
                
                {/* Filter Chips */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <FilterList />
                    {['all', 'document', 'video', 'link'].map((type) => (
                        <Chip
                            key={type}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            onClick={() => setSelectedType(type)}
                            color={selectedType === type ? 'primary' : 'default'}
                            variant={selectedType === type ? 'filled' : 'outlined'}
                        />
                    ))}
                </Box>
            </Box>

            {/* Resource List */}
            <List>
                {filteredResources.map((resource, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            sx={{
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ListItemIcon>
                                {getResourceIcon(resource.type)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1">
                                        {resource.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                                        <Chip
                                            label={resource.type}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {resource.duration || resource.size}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => {/* Handle bookmark */}}
                                    sx={{ mr: 1 }}
                                >
                                    {resource.bookmarked ? (
                                        <Bookmark color="primary" />
                                    ) : (
                                        <BookmarkBorder />
                                    )}
                                </IconButton>
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, resource)}
                                >
                                    <MoreVert />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index < filteredResources.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            {/* Resource Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <OpenInNew fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Share fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                </MenuItem>
            </Menu>

            {/* Empty State */}
            {filteredResources.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        No resources found
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedType('all');
                        }}
                    >
                        Clear Filters
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ResourceLibrary;