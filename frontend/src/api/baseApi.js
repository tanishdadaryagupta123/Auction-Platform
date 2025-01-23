// Get the API URL from environment variables
const PROD_API_URL = 'https://auction-platform-icse.onrender.com';
const DEV_API_URL = 'http://localhost:5001';

// Determine which URL to use based on hostname
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

export const BASE_URL = isLocalhost ? DEV_API_URL : PROD_API_URL;

// Log the API URL being used
console.log('API URL:', BASE_URL); 