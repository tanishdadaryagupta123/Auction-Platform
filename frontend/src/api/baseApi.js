const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://auction-platform-icse.onrender.com'
  : 'http://localhost:5001'

export { BASE_URL } 