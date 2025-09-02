import React, { useState } from 'react'
import Layout from '../components/LayoutSimple'
import { AlertTriangle, Activity, Thermometer, Camera, Bell, CheckCircle } from 'lucide-react'

const MonitoringHome = () => {
  const [activeTab, setActiveTab] = useState('alerts')

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Température élevée détectée",
      description: "Poulailler A - Température: 35°C",
      time: "Il y a 15 minutes",
      severity: "Moyen"
    },
    {
      id: 2,
      type: "critical",
      title: "Mortalité anormale",
      description: "Lot Pondeuses B - 3 décès en 24h",
      time: "Il y a 2 heures",
      severity: "Critique"
    },
    {
      id: 3,
      type: "info",
      title: "Vaccin programmé",
      description: "Rappel: Vaccination prévue demain",
      time: "Il y a 6 heures",
      severity: "Info"
    }
  ]

  const environmentData = [
    { metric: "Température", value: "28°C", status: "normal", trend: "stable" },
    { metric: "Humidité", value: "65%", status: "normal", trend: "up" },
    { metric: "Qualité air", value: "Bonne", status: "good", trend: "stable" },
    { metric: "Luminosité", value: "Normal", status: "normal", trend: "down" }
  ]

  const healthMetrics = [
    { metric: "Mortalité", value: "0.2%", status: "good", target: "< 0.5%" },
    { metric: "Consommation eau", value: "Normal", status: "normal", target: "5-8L/100 volailles" },
    { metric: "Consommation aliment", value: "120g/jour", status: "normal", target: "110-130g" },
    { metric: "Production œufs", value: "85%", status: "good", target: "> 80%" }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Surveillance & Monitoring</h1>
            <p className="text-gray-600">Surveillez la santé et l'environnement de vos volailles</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Prendre photo
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Configurer alertes
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Alertes actives</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Capteurs actifs</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Thermometer className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Température moy.</p>
                <p className="text-2xl font-bold text-blue-600">28°C</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">État général</p>
                <p className="text-2xl font-bold text-purple-600">Bon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alertes & Notifications
            </button>
            <button
              onClick={() => setActiveTab('environment')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'environment'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Environnement
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'health'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Santé du cheptel
            </button>
            <button
              onClick={() => setActiveTab('cameras')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cameras'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Surveillance visuelle
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
                alert.type === 'critical' ? 'border-red-500' :
                alert.type === 'warning' ? 'border-yellow-500' :
                'border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      alert.type === 'critical' ? 'bg-red-100' :
                      alert.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-sm text-gray-500 mt-2">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'Critique' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'Moyen' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {alert.severity}
                    </span>
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200">
                      Marquer comme lu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environmentData.map((data, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{data.metric}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    data.status === 'good' ? 'bg-green-100 text-green-600' :
                    data.status === 'normal' ? 'bg-blue-100 text-blue-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {data.status === 'good' ? 'Optimal' : 
                     data.status === 'normal' ? 'Normal' : 'Attention'}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{data.value}</div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Tendance:</span>
                  <span className={`text-sm ${
                    data.trend === 'up' ? 'text-green-600' :
                    data.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {data.trend === 'up' ? '↗ En hausse' :
                     data.trend === 'down' ? '↘ En baisse' :
                     '→ Stable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{metric.metric}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    metric.status === 'good' ? 'bg-green-100 text-green-600' :
                    metric.status === 'normal' ? 'bg-blue-100 text-blue-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {metric.status === 'good' ? 'Excellent' : 
                     metric.status === 'normal' ? 'Normal' : 'À surveiller'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className="text-sm text-gray-500">
                  Objectif: {metric.target}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cameras' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((camera) => (
              <div key={camera} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Caméra Poulailler {camera}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Statut:</span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      En ligne
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                      Voir en direct
                    </button>
                    <button className="bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200">
                      Paramètres
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MonitoringHome
