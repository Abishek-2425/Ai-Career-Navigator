// Replace direct axios calls with the API service
import React, { useState } from 'react';
import { resumeService } from '../../services/api';
import useForm from '../../hooks/useForm';

// ... existing code ...

// Before:
const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    const response = await axios.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    setUploadSuccess(true);
  } catch (error) {
    console.error('Upload error:', error);
    setUploadError(error.response?.data?.message || 'Upload failed');
  }
};

// After:
const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    await resumeService.uploadResume(formData);
    setUploadSuccess(true);
  } catch (error) {
    console.error('Upload error:', error);
    setUploadError(error.response?.data?.message || 'Upload failed');
  }
};

// ... existing code ...