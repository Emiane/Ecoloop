import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Plus, BarChart3, Calendar, Clock, 
  ChevronRight, Activity, AlertTriangle, CheckCircle 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const TrackingHome = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [lots, setLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user?.subscription === 'pro' || user?.subscription === 'premium') {
      fetchLots()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchLots = async () => {
    try {
      const response = await fetch(`/api/tracking/lots?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) {
        setLots(data.data)
      }
    } catch (error) {
      console.error('Erreur récupération lots:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'finished': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getProgressPercentage = (daysElapsed, plannedDuration) => {
    return Math.min(100, (daysElapsed / plannedDuration) * 100)
  }

  if (!user || (user.subscription !== 'pro' && user.subscription !== 'premium')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'fr' ? 'Suivi Pro Requis' : 'Pro Tracking Required'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'fr' 
              ? 'Le suivi des lots est disponible avec les abonnements Pro et Premium.'
              : 'Lot tracking is available with Pro and Premium subscriptions.'
            }
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            {language === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                {language === 'fr' ? 'Suivi des Lots' : 'Lot Tracking'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {language === 'fr' 
                  ? 'Suivez la performance de vos élevages au quotidien'
                  : 'Track your flock performance daily'
                }
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {language === 'fr' ? 'Nouveau Lot' : 'New Lot'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Lots Actifs' : 'Active Lots'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lots.filter(lot => lot.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Total Volailles' : 'Total Birds'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lots.reduce((sum, lot) => sum + (lot.current_quantity || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Cycles en Cours' : 'Ongoing Cycles'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lots.filter(lot => lot.status === 'active' && lot.days_remaining > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Alertes' : 'Alerts'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lots.filter(lot => lot.days_remaining < 7 && lot.days_remaining > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lots List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : lots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'fr' ? 'Aucun lot en cours' : 'No active lots'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'fr' 
                ? 'Commencez par créer votre premier lot pour suivre vos volailles.'
                : 'Start by creating your first lot to track your poultry.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              {language === 'fr' ? 'Créer un Lot' : 'Create a Lot'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {lot.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lot.breed} • {lot.current_quantity} {language === 'fr' ? 'volailles' : 'birds'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                      {lot.status_display}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {lot.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{language === 'fr' ? 'Progression' : 'Progress'}</span>
                        <span>{lot.days_elapsed} / {lot.planned_duration} {language === 'fr' ? 'jours' : 'days'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(lot.days_elapsed, lot.planned_duration)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Démarrage' : 'Started'}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(lot.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    {lot.status === 'active' && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'fr' ? 'Jours restants' : 'Days remaining'}
                        </p>
                        <p className={`font-medium ${
                          lot.days_remaining < 7 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {lot.days_remaining > 0 ? lot.days_remaining : 0} {language === 'fr' ? 'jours' : 'days'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{language === 'fr' ? 'J' : 'D'}{lot.days_elapsed}</span>
                      </div>
                      {lot.status === 'active' && lot.days_remaining < 7 && lot.days_remaining > 0 && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{language === 'fr' ? 'Fin proche' : 'Ending soon'}</span>
                        </div>
                      )}
                    </div>

                    <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                      {language === 'fr' ? 'Voir détails' : 'View details'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Lot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'fr' ? 'Créer un nouveau lot' : 'Create new lot'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'fr' 
                ? 'Cette fonctionnalité sera bientôt disponible. Vous pourrez créer et gérer vos lots directement depuis cette interface.'
                : 'This feature will be available soon. You will be able to create and manage your lots directly from this interface.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {language === 'fr' ? 'Compris' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackingHome
