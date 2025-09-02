import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('ecoloop_token')
      if (token) {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      localStorage.removeItem('ecoloop_token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data

      localStorage.setItem('ecoloop_token', token)
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success(`Bienvenue ${userData.firstName} !`)
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData)
      const { token, user: newUser } = response.data

      localStorage.setItem('ecoloop_token', token)
      setUser(newUser)
      setIsAuthenticated(true)
      
      toast.success(`Compte créé avec succès ! Bienvenue ${newUser.firstName}`)
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création du compte'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('ecoloop_token')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      setUser(response.data.user)
      toast.success('Profil mis à jour avec succès')
      return { success: true, user: response.data.user }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('Instructions envoyées par email')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'envoi'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      await api.post('/auth/reset-password', { token, password })
      toast.success('Mot de passe réinitialisé avec succès')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la réinitialisation'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Check subscription level
  const hasSubscription = (requiredLevel) => {
    if (!user) return false
    
    const levels = ['free', 'pro', 'premium']
    const userLevel = user.subscription || 'free'
    const userLevelIndex = levels.indexOf(userLevel)
    const requiredLevelIndex = levels.indexOf(requiredLevel)
    
    return userLevelIndex >= requiredLevelIndex
  }

  const canAccessFeature = (feature) => {
    const featureAccess = {
      training: 'free',
      tracking: 'pro',
      monitoring: 'premium',
      forum: 'free',
      multipleLots: 'pro',
      advancedAnalytics: 'premium'
    }
    
    return hasSubscription(featureAccess[feature] || 'premium')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    hasSubscription,
    canAccessFeature,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
