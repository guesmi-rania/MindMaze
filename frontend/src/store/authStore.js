import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authAPI } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authAPI.login({ email, password })
      await AsyncStorage.setItem('mindmaze_token', res.data.token)
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur de connexion', isLoading: false })
      return false
    }
  },

  register: async (username, email, password, avatar) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authAPI.register({ username, email, password, avatar })
      await AsyncStorage.setItem('mindmaze_token', res.data.token)
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur inscription', isLoading: false })
      return false
    }
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('mindmaze_token')
      if (!token) return
      const res = await authAPI.me()
      set({ user: res.data, token, isAuthenticated: true })
    } catch {
      await AsyncStorage.removeItem('mindmaze_token')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  updateUser: (user) => set({ user }),

  logout: async () => {
    await AsyncStorage.removeItem('mindmaze_token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))