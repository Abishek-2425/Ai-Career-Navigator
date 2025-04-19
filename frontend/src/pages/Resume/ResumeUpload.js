import React, { useState } from 'react';
import { resumeService } from '../../services/api';
import useForm from '../../hooks/useForm';

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