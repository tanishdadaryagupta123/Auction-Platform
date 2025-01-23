const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  console.warn('API URL not configured! Using default localhost:5001');
}

export const BASE_URL = API_URL || 'http://localhost:5001';

// Log the API URL being used
console.log('API URL:', BASE_URL); 