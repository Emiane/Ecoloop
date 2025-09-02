import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérifier s'il y a un utilisateur stocké au démarrage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email, password) => {
    try {
      // Tentative de connexion avec l'API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      
      if (data.success) {
        const user = {
          id: data.user?.id || 1,
          name: data.user?.name || 'Utilisateur',
          email: email,
          subscription: 'free',
          role: 'user'
        }
        setUser(user)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      } else {
        return false
      }
    } catch (error) {
      // Fallback: connexion simulée
      const mockUser = {
        id: 1,
        name: 'Utilisateur Test',
        email: email,
        subscription: 'free',
        role: 'user'
      }
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const updateProfile = async (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
