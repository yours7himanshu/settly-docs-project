import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api' })

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export default api

