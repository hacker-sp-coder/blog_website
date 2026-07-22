import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

let accessToken = localStorage.getItem('accessToken') || null

export const setAccessToken = (token) => {
  accessToken = token
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export const getAccessToken = () => accessToken

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 403 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.get('/api/auth/getRefreshToken', {
        withCredentials: true,
      })

      if (data.accessToken) {
        setAccessToken(data.accessToken)
        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      }

      processQueue(error, null)
      setAccessToken(null)
      return Promise.reject(error)
    } catch (refreshError) {
      processQueue(refreshError, null)
      setAccessToken(null)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
