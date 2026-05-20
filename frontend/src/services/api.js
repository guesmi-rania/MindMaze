import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://mindmaze-eyhp.onrender.com/api' 

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('mindmaze_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
}

// Game
export const gameAPI = {
  saveSession: (data) => api.post('/game/session', data),
  history:     ()     => api.get('/game/history'),
  stats:       ()     => api.get('/game/stats'),
}

// Leaderboard
export const leaderboardAPI = {
  global: () => api.get('/leaderboard/global'),
  weekly: () => api.get('/leaderboard/weekly'),
}

export default api