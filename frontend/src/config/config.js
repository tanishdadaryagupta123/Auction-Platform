const ENVIRONMENT = import.meta.env.MODE
const PROD_API_URL = 'https://auction-platform-icse.onrender.com'  // Your deployed backend URL
const DEV_API_URL = 'http://localhost:5001'

export const API_URL = ENVIRONMENT === 'production' ? PROD_API_URL : DEV_API_URL 