import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import LandingPageNew from './pages/LandingPageNew'
import TrainingHomeNew from './pages/TrainingHomeNew'
import TrackingHomeNew from './pages/TrackingHomeNew'
import MonitoringHomeNew from './pages/MonitoringHomeNew'
import ForumHomeNew from './pages/ForumHomeNew'

// Pages d'authentification simplifiées
const QuickLoginPage = () => {
  const navigate = useNavigate()
  
  const handleQuickAccess = () => {
    // Connexion rapide pour démo
    localStorage.setItem('ecoloop_user', JSON.stringify({
      name: 'Utilisateur Démo',
      email: 'demo@ecoloop.com',
      plan: 'Gratuit'
    }))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Accès Rapide</h2>
          <p className="text-gray-600">Accédez directement à la plateforme</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleQuickAccess}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🚀 Accès Direct au Dashboard
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to="/training"
              className="bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors text-center"
            >
              📚 Formation
            </Link>
            <Link 
              to="/tracking"
              className="bg-purple-50 text-purple-600 py-2 px-3 rounded text-sm hover:bg-purple-100 transition-colors text-center"
            >
              📊 Suivi
            </Link>
            <Link 
              to="/monitoring"
              className="bg-red-50 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-100 transition-colors text-center"
            >
              🔍 Surveillance
            </Link>
            <Link 
              to="/forum"
              className="bg-yellow-50 text-yellow-600 py-2 px-3 rounded text-sm hover:bg-yellow-100 transition-colors text-center"
            >
              💬 Forum
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-6">
          <Link to="/" className="text-green-600 hover:underline">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  )
}

// Dashboard simple
const SimpleDashboard = () => {
  const modules = [
    { 
      name: 'Formation', 
      description: 'Modules éducatifs pour l\'élevage', 
      icon: '🎓',
      badge: 'Gratuit',
      path: '/training'
    },
    { 
      name: 'Suivi', 
      description: 'Gestion des lots de volaille', 
      icon: '📊',
      badge: 'Pro',
      path: '/tracking'
    },
    { 
      name: 'Surveillance', 
      description: 'Monitoring en temps réel', 
      icon: '🔍',
      badge: 'Premium',
      path: '/monitoring'
    },
    { 
      name: 'Forum', 
      description: 'Communauté d\'éleveurs', 
      icon: '💬',
      badge: 'Gratuit',
      path: '/forum'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="EcoLoop Logo" 
                className="w-10 h-10 rounded-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2316a34a" rx="12"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-weight="bold">E</text></svg>'
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">EcoLoop Dashboard</h1>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">Poulets de Chair</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-green-600 hover:underline">← Retour accueil</Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('ecoloop_user')
                  window.location.href = '/'
                }}
                className="text-red-600 hover:underline text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur EcoLoop</h2>
          <p className="text-gray-600">Choisissez un module pour commencer</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{module.icon}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  module.badge === 'Gratuit' 
                    ? 'bg-gray-100 text-gray-600' 
                    : module.badge === 'Pro'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {module.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              <Link 
                to={module.path}
                className="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Accéder
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">🎉 EcoLoop - Plateforme complète d'élevage avicole</h3>
          <div className="text-green-700 space-y-1">
            <p>✅ Tous les modules fonctionnels et accessibles</p>
            <p>✅ Navigation fluide entre les fonctionnalités</p>
            <p>✅ Interface moderne et responsive</p>
            <p>✅ Données de démonstration incluses</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPageNew />} />
          <Route path="/login" element={<QuickLoginPage />} />
          <Route path="/signup" element={<QuickLoginPage />} />
          <Route path="/dashboard" element={<SimpleDashboard />} />
          <Route path="/training" element={<TrainingHomeNew />} />
          <Route path="/tracking" element={<TrackingHomeNew />} />
          <Route path="/monitoring" element={<MonitoringHomeNew />} />
          <Route path="/forum" element={<ForumHomeNew />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
