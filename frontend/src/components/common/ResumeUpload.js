import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CloudUpload, Delete, Description, CheckCircle } from '@mui/icons-material';

/**
 * ResumeUpload component for handling resume file uploads
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Callback function when file is uploaded
 * @param {Function} props.onDelete - Callback function when file is deleted
 * @param {string} props.currentResume - URL of the current resume if one exists
 * @param {string} props.currentResumeName - Name of the current resume file
 * @param {boolean} props.isUploading - Whether a file is currently being uploaded
 * @param {string} props.error - Error message if upload failed
 */
const ResumeUpload = ({
  onUpload,
  onDelete,
  currentResume = '',
  currentResumeName = '',
  isUploading = false,
  error = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Validate file type and size
  const validateAndUploadFile = (file) => {
    setLocalError('');
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setLocalError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File is too large. Maximum size is 5MB.');
      return;
    }
    
    // Call the onUpload callback with the validated file
    onUpload(file);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        width: '100%',
        borderRadius: 2,
        backgroundColor: dragActive ? theme.palette.action.hover : theme.palette.background.paper,
        border: dragActive ? `2px dashed ${theme.palette.primary.main}` : '2px dashed transparent',
        transition: 'all 0.2s ease-in-out'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      role="region"
      aria-label="Resume upload area"
    >
      {/* Error messages */}
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || localError}
        </Alert>
      )}
      
      {/* Current resume display */}
      {currentResume && !isUploading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Description color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
            {currentResumeName || 'Current Resume'}
          </Typography>
          <Tooltip title="Delete resume">
            <IconButton 
              onClick={onDelete} 
              color="error" 
              aria-label="Delete resume"
              size="small"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 3,
            textAlign: 'center'
          }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1">Uploading resume...</Typography>
            </>
          ) : (
            <>
              <CloudUpload 
                color="primary" 
                sx={{ fontSize: 48, mb: 2 }} 
                aria-hidden="true"
              />
              <Typography variant="h6" gutterBottom>
                Upload Your Resume
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Drag and drop your resume here, or click to browse
              </Typography>
              <Button
                variant="contained"
                onClick={handleButtonClick}
                startIcon={<CloudUpload />}
                disabled={isUploading}
                aria-label="Browse for resume file"
              >
                Browse Files
              </Button>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
                Supported formats: PDF, DOC, DOCX (Max size: 5MB)
              </Typography>
            </>
          )}
        </Box>
      )}
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-label="Upload resume"
      />
    </Paper>
  );
};

export default ResumeUpload;