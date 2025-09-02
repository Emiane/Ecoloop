import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const ProtectedRoute = ({ children, requiredSubscription = 'free' }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check subscription level
  if (requiredSubscription !== 'free') {
    const levels = ['free', 'pro', 'premium']
    const userLevel = user?.subscription || 'free'
    const userLevelIndex = levels.indexOf(userLevel)
    const requiredLevelIndex = levels.indexOf(requiredSubscription)

    if (userLevelIndex < requiredLevelIndex) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="card max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-orange-web/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-web" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('subscription.upgradeRequired', 'Abonnement requis')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('subscription.upgradeMessage', `Cette fonctionnalité nécessite un abonnement ${requiredSubscription.toUpperCase()}.`)}
            </p>
            <div className="space-y-3">
              <button className="btn-primary w-full">
                {t('subscription.upgrade', 'Améliorer mon abonnement')}
              </button>
              <button 
                onClick={() => window.history.back()}
                className="btn-outline w-full"
              >
                {t('common.back', 'Retour')}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute
