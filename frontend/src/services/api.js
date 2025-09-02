import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoloop_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('ecoloop_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const trainingAPI = {
  getCategories: () => api.get('/training/categories'),
  getContent: (category) => api.get(`/training/content/${category}`),
  getArticle: (id) => api.get(`/training/article/${id}`),
  getDiseases: () => api.get('/training/diseases'),
  getEquipment: () => api.get('/training/equipment'),
  getVaccination: () => api.get('/training/vaccination'),
  quiz: {
    getQuestions: (category) => api.get(`/training/quiz/${category}`),
    submitAnswers: (quizId, answers) => api.post(`/training/quiz/${quizId}/submit`, { answers }),
    getResults: (userId) => api.get(`/training/quiz/results/${userId}`),
  },
}

export const trackingAPI = {
  createAnalysis: (data) => api.post('/tracking/analysis', data),
  getPlans: () => api.get('/tracking/plans'),
  getPlan: (id) => api.get(`/tracking/plan/${id}`),
  createLot: (data) => api.post('/tracking/lots', data),
  getLots: () => api.get('/tracking/lots'),
  getLot: (id) => api.get(`/tracking/lot/${id}`),
  updateDailyProgress: (lotId, day, data) => api.put(`/tracking/lot/${lotId}/day/${day}`, data),
  getDailyProgress: (lotId) => api.get(`/tracking/lot/${lotId}/progress`),
  getStatistics: (lotId) => api.get(`/tracking/statistics/${lotId}`),
}

export const monitoringAPI = {
  getDevices: () => api.get('/monitoring/devices'),
  getDeviceData: (deviceId) => api.get(`/monitoring/device/${deviceId}`),
  updateSettings: (deviceId, settings) => api.put(`/monitoring/device/${deviceId}/settings`, settings),
  getAlerts: () => api.get('/monitoring/alerts'),
  sendCommand: (deviceId, command) => api.post(`/monitoring/device/${deviceId}/command`, { command }),
  getCameraFeed: (deviceId) => api.get(`/monitoring/device/${deviceId}/camera`),
}

export const forumAPI = {
  getCategories: () => api.get('/forum/categories'),
  getPosts: (category, page = 1) => api.get(`/forum/posts/${category}?page=${page}`),
  getPost: (id) => api.get(`/forum/post/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.put(`/forum/post/${id}`, data),
  deletePost: (id) => api.delete(`/forum/post/${id}`),
  addComment: (postId, comment) => api.post(`/forum/post/${postId}/comments`, { comment }),
  votePost: (postId, vote) => api.post(`/forum/post/${postId}/vote`, { vote }),
}

export const chatbotAPI = {
  sendMessage: (message, context = 'poultry') => api.post('/chatbot/message', { message, context }),
  getHistory: () => api.get('/chatbot/history'),
  clearHistory: () => api.delete('/chatbot/history'),
}

export const adminAPI = {
  getUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  updateUser: (id, data) => api.put(`/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  getStatistics: () => api.get('/admin/statistics'),
  getContent: () => api.get('/admin/content'),
  updateContent: (id, data) => api.put(`/admin/content/${id}`, data),
  createContent: (data) => api.post('/admin/content', data),
  deleteContent: (id) => api.delete(`/admin/content/${id}`),
  getLogs: (page = 1) => api.get(`/admin/logs?page=${page}`),
}

export const subscriptionAPI = {
  getPlans: () => api.get('/subscription/plans'),
  getCurrentSubscription: () => api.get('/subscription/current'),
  subscribe: (planId) => api.post('/subscription/subscribe', { planId }),
  cancel: () => api.post('/subscription/cancel'),
  getPaymentHistory: () => api.get('/subscription/payments'),
}

export { api }
export default api
