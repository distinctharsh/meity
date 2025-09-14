// Authentication utility functions for admin panel

export const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const handleApiResponse = async (response) => {
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    return null;
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return await response.json();
};

export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
  
  return handleApiResponse(response);
};
