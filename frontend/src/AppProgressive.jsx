import React, { useState, useEffect } from 'react'
import LoginPageNew from './LoginPageNew.jsx'
import DashboardModern from './DashboardModern.jsx'
import LandingPageModern from './LandingPageModern.jsx'
import SignupPageModern from './pages/SignupPageModern.jsx'

function AppProgressive() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'login', 'signup', 'dashboard'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setCurrentView('dashboard')
      } catch (error) {
        console.error('Erreur parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentView('landing')
  }

  const handleSignupSuccess = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fffe'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo.png" 
            alt="EcoLoop" 
            style={{ height: '60px', marginBottom: '20px' }}
          />
          <h2 style={{ 
            color: '#2d5a27',
            background: 'linear-gradient(135deg, #2d5a27, #4a8c3a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            EcoLoop
          </h2>
          <p style={{ color: '#5a6c57' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (currentView === 'landing') {
    return (
      <LandingPageModern 
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    )
  }

  if (currentView === 'login') {
    return (
      <LoginPageNew 
        onLogin={handleLogin}
        onBackToLanding={() => setCurrentView('landing')}
        onGoToSignup={() => setCurrentView('signup')}
      />
    )
  }

  if (currentView === 'signup') {
    return (
      <SignupPageModern 
        onSignupSuccess={handleSignupSuccess}
        onBackToLanding={() => setCurrentView('landing')}
        onGoToLogin={() => setCurrentView('login')}
      />
    )
  }

  if (currentView === 'dashboard' && user) {
    return (
      <DashboardModern user={user} onLogout={handleLogout} />
    )
  }

  return (
    <div>
      {user ? (
        <DashboardModern user={user} onLogout={handleLogout} />
      ) : (
        <LoginPageNew onLogin={handleLogin} />
      )}
    </div>
  )
}

export default AppProgressive
