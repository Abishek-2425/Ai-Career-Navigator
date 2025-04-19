/**
 * API utilities for standardizing API calls and error handling
 * Reduces code duplication across Redux slices and components
 */

import axios from 'axios';

// Standard error handler for API calls
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
  console.error('API Error:', errorMessage, error);
  return errorMessage;
};

// Standard API call wrapper with error handling
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await axios[method](url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = handleApiError(error);
    return { success: false, error: errorMessage };
  }
};

// Helper for creating async thunk API calls with standard patterns
export const createApiThunk = (typePrefix, apiCallFn, options = {}) => {
  return async (arg, thunkAPI) => {
    try {
      // Check authentication if required
      if (options.requiresAuth) {
        const state = thunkAPI.getState();
        if (!state.auth.isAuthenticated) {
          return thunkAPI.rejectWithValue('Authentication required');
        }
      }
      
      // Execute the API call
      const result = await apiCallFn(arg, thunkAPI);
      
      // Handle success and error cases
      if (result.success) {
        return result.data;
      } else {
        return thunkAPI.rejectWithValue(result.error);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  };
};

// Standard loading states for Redux slices
export const loadingStates = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed'
};

// Standard reducer cases for handling async thunks
export const createAsyncThunkReducers = (builder, thunk) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.status = loadingStates.loading;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.status = loadingStates.succeeded;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.status = loadingStates.failed;
      state.error = action.payload || 'An error occurred';
    });
};