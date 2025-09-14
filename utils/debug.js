// Debug utility functions for development

export const logApiCall = (url, method, data, response, error = null) => {
  console.group(`🌐 API Call: ${method} ${url}`);
  console.log('📤 Request Data:', data);
  if (response) {
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', response);
  }
  if (error) {
    console.error('❌ Error:', error);
  }
  console.groupEnd();
};

export const logComponentState = (componentName, state) => {
  console.group(`🔧 ${componentName} State:`);
  console.log(state);
  console.groupEnd();
};

export const logFormData = (formName, formData) => {
  console.group(`📝 ${formName} Form Data:`);
  Object.entries(formData).forEach(([key, value]) => {
    console.log(`${key}:`, value);
  });
  console.groupEnd();
};

export const validateFormData = (formData, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to properly handle boolean values from database
export const parseBoolean = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return false;
};

// Utility function to convert boolean to database format
export const toDatabaseBoolean = (value) => {
  return value ? 1 : 0;
};
