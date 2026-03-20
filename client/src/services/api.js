import axios from 'axios'

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  res  => res.data,
  err  => Promise.reject(err.response?.data || { message: 'Network error' })
)

export default api