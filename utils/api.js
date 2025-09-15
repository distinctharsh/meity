// Utility functions for API calls with cache-busting
import { useState, useEffect } from 'react';

/**
 * Fetch data from API with cache-busting parameters
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchWithCacheBusting = async (url, options = {}) => {
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}t=${timestamp}`;

  return fetch(urlWithTimestamp, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    },
    ...options
  });
};

const readErrorPayload = async (response) => {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return { body: json };
    }
    const text = await response.text();
    return { body: text };
  } catch (err) {
    return { body: '<<unable to read body>>' };
  }
};

/**
 * Fetch announcements with cache-busting
 * @returns {Promise<Array>}
 */
export const fetchAnnouncements = async () => {
  try {
    const response = await fetchWithCacheBusting('/api/admin/announcements');
    if (response.ok) {
      return await response.json();
    }
    const { body } = await readErrorPayload(response);
    console.error('Announcements fetch failed', {
      status: response.status,
      statusText: response.statusText,
      body
    });
    return [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

/**
 * Fetch offerings with cache-busting
 * @returns {Promise<Array>}
 */
export const fetchOfferings = async () => {
  try {
    const response = await fetchWithCacheBusting('/api/admin/offerings');
    if (response.ok) {
      return await response.json();
    }
    const { body } = await readErrorPayload(response);
    console.error('Offerings fetch failed', {
      status: response.status,
      statusText: response.statusText,
      body
    });
    return [];
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return [];
  }
};

/**
 * Fetch slider data with cache-busting
 * @returns {Promise<Array>}
 */
export const fetchSliderData = async () => {
  try {
    const response = await fetchWithCacheBusting('/api/admin/slider');
    if (response.ok) {
      return await response.json();
    }
    const { body } = await readErrorPayload(response);
    console.error('Slider fetch failed', {
      status: response.status,
      statusText: response.statusText,
      body
    });
    return [];
  } catch (error) {
    console.error('Error fetching slider data:', error);
    return [];
  }
};

/**
 * Auto-refresh hook for components
 * @param {Function} fetchFunction - Function to fetch data
 * @param {number} interval - Refresh interval in milliseconds (default: 30000)
 * @returns {Array} [data, loading, error, refetch]
 */
export const useAutoRefresh = (fetchFunction, interval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const refreshInterval = setInterval(fetchData, interval);
    return () => clearInterval(refreshInterval);
  }, [interval]);

  return [data, loading, error, fetchData];
};
