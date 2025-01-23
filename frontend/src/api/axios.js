import axios from 'axios'

const BASE_URL = 'https://auction-platform-icse.onrender.com'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Always ensure we're using the production URL
    if (!config.url.startsWith('https://')) {
      config.url = `${BASE_URL}${config.url.startsWith('/') ? config.url : `/${config.url}`}`
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 