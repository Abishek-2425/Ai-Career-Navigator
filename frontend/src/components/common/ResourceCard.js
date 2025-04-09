import React from 'react';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Box,
    Chip,
    IconButton
} from '@mui/material';
import {
    Description,
    VideoLibrary,
    Link as LinkIcon,
    BookmarkBorder,
    Bookmark,
    MoreVert
} from '@mui/icons-material';

const ResourceCard = ({ 
    resource, 
    onBookmark, 
    onMenuOpen, 
    showDivider = false 
}) => {
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

    return (
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
                    onClick={() => onBookmark(resource)}
                    sx={{ mr: 1 }}
                >
                    {resource.bookmarked ? (
                        <Bookmark color="primary" />
                    ) : (
                        <BookmarkBorder />
                    )}
                </IconButton>
                <IconButton
                    onClick={(e) => onMenuOpen(e, resource)}
                >
                    <MoreVert />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default ResourceCard;