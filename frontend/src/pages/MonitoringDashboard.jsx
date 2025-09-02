import React, { useState, useEffect } from 'react'
import { 
  Eye, Thermometer, Droplets, Wind, Activity, 
  AlertTriangle, CheckCircle, Wifi, WifiOff, 
  Camera, Sensor, TrendingUp, BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const MonitoringDashboard = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLot, setSelectedLot] = useState(null)

  useEffect(() => {
    if (user?.subscription === 'premium') {
      fetchDashboardData()
      // Actualiser toutes les 30 secondes
      const interval = setInterval(fetchDashboardData, 30000)
      return () => clearInterval(interval)
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/monitoring/dashboard?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) {
        setDashboardData(data.data)
        if (!selectedLot && data.data.activeLots.length > 0) {
          setSelectedLot(data.data.activeLots[0].id)
        }
      }
    } catch (error) {
      console.error('Erreur récupération dashboard monitoring:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default: return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getValueColor = (value, thresholds) => {
    if (value > thresholds.critical) return 'text-red-600 dark:text-red-400'
    if (value > thresholds.warning) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (!user || user.subscription !== 'premium') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'fr' ? 'Monitoring Premium Requis' : 'Premium Monitoring Required'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'fr' 
              ? 'Le monitoring en temps réel est disponible exclusivement avec l\'abonnement Premium.'
              : 'Real-time monitoring is available exclusively with Premium subscription.'
            }
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            {language === 'fr' ? 'Passer à Premium' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'fr' ? 'Chargement des données de monitoring...' : 'Loading monitoring data...'}
          </p>
        </div>
      </div>
    )
  }

  const selectedLotData = dashboardData?.realtimeData?.find(lot => lot.lot_id === selectedLot)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Eye className="w-8 h-8 text-purple-600" />
                {language === 'fr' ? 'Monitoring' : 'Monitoring'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {language === 'fr' 
                  ? 'Surveillance en temps réel de vos élevages'
                  : 'Real-time monitoring of your farms'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData?.globalStats?.total_active_lots || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Lots Actifs' : 'Active Lots'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData?.globalStats?.total_birds || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Volailles' : 'Birds'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Lot Selector */}
        {dashboardData?.activeLots?.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'fr' ? 'Sélectionner un lot' : 'Select a lot'}
            </label>
            <select
              value={selectedLot || ''}
              onChange={(e) => setSelectedLot(e.target.value)}
              className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {dashboardData.activeLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name} ({lot.current_quantity} {language === 'fr' ? 'volailles' : 'birds'})
                </option>
              ))}
            </select>
          </div>
        )}

        {dashboardData?.activeLots?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'fr' ? 'Aucun lot à surveiller' : 'No lots to monitor'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'fr' 
                ? 'Créez un lot dans la section Suivi pour commencer le monitoring.'
                : 'Create a lot in the Tracking section to start monitoring.'
              }
            </p>
          </div>
        ) : selectedLotData && (
          <div className="space-y-8">
            {/* Environmental Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Température' : 'Temperature'}
                      </p>
                      <p className={`text-2xl font-bold ${getValueColor(selectedLotData.environment.temperature, { warning: 30, critical: 35 })}`}>
                        {selectedLotData.environment.temperature.toFixed(1)}°C
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Optimal: 25-28°C' : 'Optimal: 25-28°C'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Humidité' : 'Humidity'}
                      </p>
                      <p className={`text-2xl font-bold ${getValueColor(selectedLotData.environment.humidity, { warning: 75, critical: 85 })}`}>
                        {selectedLotData.environment.humidity.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Optimal: 60-70%' : 'Optimal: 60-70%'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                      <Wind className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Qualité Air' : 'Air Quality'}
                      </p>
                      <p className={`text-2xl font-bold ${getValueColor(100 - selectedLotData.environment.air_quality_index, { warning: 30, critical: 50 })}`}>
                        {selectedLotData.environment.air_quality_index}/100
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'NH₃: ' : 'NH₃: '}{selectedLotData.environment.ammonia_level.toFixed(1)}ppm
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Activité' : 'Activity'}
                      </p>
                      <p className={`text-2xl font-bold ${getValueColor(selectedLotData.behavior.activity_level, { warning: 50, critical: 30 }, true)}`}>
                        {selectedLotData.behavior.activity_level}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Normal: >70%' : 'Normal: >70%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {selectedLotData.alerts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'fr' ? 'Alertes Actives' : 'Active Alerts'}
                </h3>
                <div className="space-y-3">
                  {selectedLotData.alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
                    }`}>
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {language === 'fr' ? alert.message_fr : alert.message_en}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'fr' ? 'Valeur:' : 'Value:'} {alert.value} | 
                          {language === 'fr' ? ' Seuil:' : ' Threshold:'} {alert.threshold}
                        </p>
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {language === 'fr' ? 'Acquitter' : 'Acknowledge'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Behavior Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'fr' ? 'Comportement Alimentaire' : 'Feeding Behavior'}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Fréquence' : 'Frequency'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedLotData.behavior.feeding_frequency}/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Consommation eau' : 'Water consumption'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedLotData.behavior.water_consumption_rate.toFixed(1)}L/h
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'fr' ? 'Indicateurs de Stress' : 'Stress Indicators'}
                </h4>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    selectedLotData.behavior.stress_indicators > 20 ? 'text-red-600' : 
                    selectedLotData.behavior.stress_indicators > 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedLotData.behavior.stress_indicators}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedLotData.behavior.stress_indicators > 20 ? 
                      (language === 'fr' ? 'Élevé' : 'High') :
                      selectedLotData.behavior.stress_indicators > 10 ?
                      (language === 'fr' ? 'Modéré' : 'Moderate') :
                      (language === 'fr' ? 'Faible' : 'Low')
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'fr' ? 'Tendances' : 'Trends'}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Activité stable' : 'Stable activity'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Croissance normale' : 'Normal growth'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Devices Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'fr' ? 'État des Capteurs' : 'Sensor Status'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'fr' ? 'Capteur T°' : 'Temp Sensor'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Wifi className="w-3 h-3" />
                      <span>{language === 'fr' ? 'En ligne' : 'Online'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'fr' ? 'Capteur Humidité' : 'Humidity Sensor'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Wifi className="w-3 h-3" />
                      <span>{language === 'fr' ? 'En ligne' : 'Online'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Sensor className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'fr' ? 'Capteur NH₃' : 'NH₃ Sensor'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <WifiOff className="w-3 h-3" />
                      <span>{language === 'fr' ? 'Hors ligne' : 'Offline'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'fr' ? 'Caméra IA' : 'AI Camera'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Wifi className="w-3 h-3" />
                      <span>{language === 'fr' ? 'Enregistrement' : 'Recording'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonitoringDashboard
