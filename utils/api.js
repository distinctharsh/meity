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
    const response = await fetchWithCacheBusting('/api/home');
    if (response.ok) {
      const data = await response.json();
      return data.announcements || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

/**
 * Standard Data Fetch Hook (Without 30-second auto-refresh polling)
 * @param {Function} fetchFunction - Function to fetch data
 * @returns {Array} [data, loading, error, refetch]
 */
export const useAutoRefresh = (fetchFunction) => {
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
  }, []);

  return [data, loading, error, fetchData];
};



export const syncHomeData = async () => {
  try {
    const response = await fetchWithCacheBusting('/api/adm/sync-home-data', {
      method: 'POST',
    });
    if (!response.ok) {
      console.error('Home data sync failed');
    }
  } catch (error) {
    console.error('Home data sync error:', error);
  }
};