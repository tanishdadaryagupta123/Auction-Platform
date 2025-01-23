import axios from 'axios'
import { API_URL } from '../config/config'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://auction-platform-ruddy.vercel.app'
  },
  withCredentials: true
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Remove any localhost URLs
    if (config.url?.startsWith('http://localhost')) {
      config.url = config.url.replace('http://localhost:5001', API_URL)
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 