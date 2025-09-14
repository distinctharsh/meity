/**
 * Error handling utility functions for better error management
 */

/**
 * Handles API response errors and returns appropriate error messages
 * @param {Response} response - The fetch response object
 * @returns {Promise<string>} - Error message
 */
export const handleApiError = async (response) => {
  try {
    const errorData = await response.json();
    return errorData.message || `HTTP ${response.status}: ${response.statusText}`;
  } catch (jsonError) {
    // If JSON parsing fails, return generic HTTP error
    return `HTTP ${response.status}: ${response.statusText}`;
  }
};

/**
 * Handles network errors and returns appropriate error messages
 * @param {Error} error - The caught error
 * @returns {string} - Error message
 */
export const handleNetworkError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Unable to connect to server. Please check your internet connection.';
  } else if (error.name === 'AbortError') {
    return 'Request was cancelled';
  } else if (error.name === 'SyntaxError') {
    return 'Invalid response format from server';
  } else if (error.name === 'ReferenceError') {
    return 'Configuration error in the application';
  } else {
    return `Network error: ${error.message}`;
  }
};

/**
 * Generic error handler for API calls
 * @param {Function} apiCall - The API function to call
 * @param {string} operation - Description of the operation for error messages
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback (optional)
 * @returns {Promise<void>}
 */
export const handleApiCall = async (apiCall, operation, onSuccess, onError = null) => {
  try {
    const response = await apiCall();
    
    if (response.ok) {
      const data = await response.json();
      onSuccess(data);
    } else {
      const errorMessage = await handleApiError(response);
      console.error(`${operation} error:`, errorMessage);
      
      if (onError) {
        onError(errorMessage);
      } else {
        alert(`Failed to ${operation.toLowerCase()}: ${errorMessage}`);
      }
    }
  } catch (error) {
    const errorMessage = handleNetworkError(error);
    console.error(`${operation} network error:`, error);
    
    if (onError) {
      onError(errorMessage);
    } else {
      alert(`Failed to ${operation.toLowerCase()}: ${errorMessage}`);
    }
  }
};

/**
 * Shows user-friendly error messages
 * @param {string} operation - The operation that failed
 * @param {string} errorMessage - The specific error message
 * @param {string} type - Type of error (error, warning, info)
 */
export const showErrorMessage = (operation, errorMessage, type = 'error') => {
  const message = `Failed to ${operation.toLowerCase()}: ${errorMessage}`;
  
  // You can replace this with a proper toast notification system
  if (type === 'error') {
    alert(`❌ ${message}`);
  } else if (type === 'warning') {
    alert(`⚠️ ${message}`);
  } else {
    alert(`ℹ️ ${message}`);
  }
};

/**
 * Shows success messages
 * @param {string} operation - The operation that succeeded
 * @param {string} details - Additional details (optional)
 */
export const showSuccessMessage = (operation, details = '') => {
  const message = `${operation} successful!${details ? ` ${details}` : ''}`;
  alert(`✅ ${message}`);
};

/**
 * Validates API response and throws appropriate errors
 * @param {Response} response - The fetch response object
 * @param {string} operation - The operation being performed
 * @returns {Promise<any>} - Parsed JSON data
 */
export const validateApiResponse = async (response, operation) => {
  if (!response.ok) {
    const errorMessage = await handleApiError(response);
    throw new Error(`${operation} failed: ${errorMessage}`);
  }
  
  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error(`${operation} failed: Invalid response format from server`);
  }
};

/**
 * Retry mechanism for failed API calls
 * @param {Function} apiCall - The API function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise<any>} - API response
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiCall();
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await handleApiError(response);
        lastError = new Error(errorMessage);
      }
    } catch (error) {
      lastError = error;
    }
    
    if (attempt < maxRetries) {
      console.warn(`API call attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
