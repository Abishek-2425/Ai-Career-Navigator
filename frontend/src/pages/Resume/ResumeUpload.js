import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CloudUpload,
  Description,
  CheckCircle,
  Info,
  ArrowForward
} from '@mui/icons-material';
import { resumeService } from '../../services/api';
import { LoadingState, ErrorMessage } from '../../components/common';
import Layout from '../../components/layout/Layout';

// Helper function to create alpha colors
const alpha = (color, value) => {
  return color.replace('rgb', 'rgba').replace(')', `, ${value})`);
};

const ResumeUpload = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  // Clear any errors when component mounts or when file changes
  const clearErrors = () => {
    if (uploadError) setUploadError(null);
  };

  const onDrop = useCallback(acceptedFiles => {
    // Only accept the first file if multiple are dropped
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      clearErrors();
    }
  }, [uploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      const response = await resumeService.uploadResume(formData);
      setUploadSuccess(true);
      setResumeId(response.data.resumeId);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = () => {
    if (resumeId) {
      navigate(`/resume/analysis/${resumeId}`);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    setResumeId(null);
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            Resume Upload
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Upload your resume to get personalized career recommendations and skill gap analysis.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                {uploadSuccess ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4
                    }}
                  >
                    <CheckCircle 
                      color="success" 
                      sx={{ fontSize: 64, mb: 2 }}
                      aria-hidden="true"
                    />
                    <Typography variant="h5" gutterBottom align="center">
                      Resume Uploaded Successfully!
                    </Typography>
                    <Typography variant="body1" align="center" paragraph>
                      Your resume has been uploaded and is being analyzed.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleViewAnalysis}
                        endIcon={<ArrowForward />}
                        aria-label="View resume analysis"
                      >
                        View Analysis
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={handleReset}
                        aria-label="Upload another resume"
                      >
                        Upload Another
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box 
                      {...getRootProps()} 
                      sx={{
                        border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                        borderRadius: 1,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        },
                        mb: 3
                      }}
                      aria-label="Drag and drop area for resume upload"
                      role="button"
                    >
                      <input {...getInputProps()} aria-label="Resume file input" />
                      <CloudUpload 
                        sx={{ 
                          fontSize: { xs: 48, sm: 64 }, 
                          color: isDragActive ? 'primary.main' : 'text.secondary',
                          mb: 2
                        }}
                        aria-hidden="true"
                      />
                      <Typography variant="h6" gutterBottom>
                        {isDragActive ? 'Drop your resume here' : 'Drag & Drop your resume'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to browse files
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Supported formats: PDF, DOC, DOCX (Max 5MB)
                      </Typography>
                    </Box>

                    {selectedFile && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Selected File:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          <Description color="primary" aria-hidden="true" />
                          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            <Typography 
                              variant="body2" 
                              noWrap 
                              title={selectedFile.name}
                              aria-label={`Selected file: ${selectedFile.name}`}
                            >
                              {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    )}

                    <ErrorMessage error={uploadError} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleUpload}
                        disabled={!selectedFile || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        aria-label="Upload resume"
                        sx={{ minWidth: '150px' }}
                      >
                        {isLoading ? 'Uploading...' : 'Upload Resume'}
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05)
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Info color="info" sx={{ mr: 1 }} aria-hidden="true" />
                  <Typography variant="h6">Why Upload Your Resume?</Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List disablePadding>
                  {[
                    'Get personalized career recommendations based on your skills and experience',
                    'Identify skill gaps for your target roles',
                    'Receive tailored learning resources to enhance your profile',
                    'Track your career progress over time'
                  ].map((text, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle color="success" fontSize="small" aria-hidden="true" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
                
                <Alert 
                  severity="info" 
                  sx={{ mt: 2 }}
                  aria-labelledby="privacy-title"
                >
                  <AlertTitle id="privacy-title">Privacy Notice</AlertTitle>
                  Your resume data is securely stored and only used to provide personalized recommendations.
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default ResumeUpload;