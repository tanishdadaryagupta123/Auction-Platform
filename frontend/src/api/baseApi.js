const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Log the API URL being used
console.log('API URL:', BASE_URL);

export { BASE_URL }; 