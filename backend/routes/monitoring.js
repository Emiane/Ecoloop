import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken, requireSubscription } from '../middleware/auth.js'

const router = express.Router()

// Fonction pour générer des données simulées
function generateSimulatedData(baseValue, variance = 0.1) {
  const variation = (Math.random() - 0.5) * 2 * variance
  return Math.round((baseValue * (1 + variation)) * 100) / 100
}

// GET /api/monitoring/dashboard - Tableau de bord monitoring
router.get('/dashboard', authenticateToken, requireSubscription(['premium']), async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Récupérer les lots actifs de l'utilisateur
    const activeLots = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, current_quantity, start_date,
          ROUND(CAST((julianday('now') - julianday(start_date)) AS REAL), 0) as days_elapsed
        FROM poultry_lots
        WHERE user_id = ? AND status = 'active'
        ORDER BY start_date DESC
      `, [req.user.id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Générer des données en temps réel simulées pour chaque lot
    const realtimeData = activeLots.map(lot => ({
      lot_id: lot.id,
      lot_name: lot.name,
      current_quantity: lot.current_quantity,
      days_elapsed: lot.days_elapsed,
      environment: {
        temperature: generateSimulatedData(28, 0.15), // Base 28°C ±15%
        humidity: generateSimulatedData(65, 0.2), // Base 65% ±20%
        ammonia_level: generateSimulatedData(15, 0.3), // Base 15ppm ±30%
        light_intensity: generateSimulatedData(20, 0.25), // Base 20 lux ±25%
        air_quality_index: Math.floor(generateSimulatedData(75, 0.2)) // Base 75 ±20%
      },
      behavior: {
        activity_level: Math.floor(generateSimulatedData(80, 0.3)), // Base 80% ±30%
        feeding_frequency: Math.floor(generateSimulatedData(45, 0.4)), // Base 45 events/hour ±40%
        water_consumption_rate: generateSimulatedData(2.5, 0.25), // Base 2.5L/100 birds/hour ±25%
        stress_indicators: Math.floor(generateSimulatedData(10, 0.5)) // Base 10% ±50%
      },
      alerts: generateAlerts(lot)
    }))

    // Statistiques globales
    const globalStats = {
      total_active_lots: activeLots.length,
      total_birds: activeLots.reduce((sum, lot) => sum + lot.current_quantity, 0),
      avg_temperature: realtimeData.reduce((sum, data) => sum + data.environment.temperature, 0) / (realtimeData.length || 1),
      avg_humidity: realtimeData.reduce((sum, data) => sum + data.environment.humidity, 0) / (realtimeData.length || 1),
      critical_alerts: realtimeData.reduce((sum, data) => sum + data.alerts.filter(a => a.severity === 'critical').length, 0),
      warning_alerts: realtimeData.reduce((sum, data) => sum + data.alerts.filter(a => a.severity === 'warning').length, 0)
    }

    res.json({
      success: true,
      data: {
        activeLots,
        realtimeData,
        globalStats,
        lastUpdate: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur dashboard monitoring:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du chargement du dashboard' : 
        'Error loading dashboard'
    })
  }
})

// Fonction pour générer des alertes simulées
function generateAlerts(lot) {
  const alerts = []
  const random = Math.random()
  
  // Alerte température (5% de chance)
  if (random < 0.05) {
    alerts.push({
      id: `temp_${lot.id}_${Date.now()}`,
      type: 'temperature',
      severity: 'warning',
      message_fr: 'Température élevée détectée',
      message_en: 'High temperature detected',
      value: generateSimulatedData(32, 0.1),
      threshold: 30,
      timestamp: new Date().toISOString()
    })
  }
  
  // Alerte humidité (3% de chance)
  if (random > 0.97) {
    alerts.push({
      id: `hum_${lot.id}_${Date.now()}`,
      type: 'humidity',
      severity: 'critical',
      message_fr: 'Humidité critique dans le bâtiment',
      message_en: 'Critical humidity in building',
      value: generateSimulatedData(85, 0.05),
      threshold: 80,
      timestamp: new Date().toISOString()
    })
  }
  
  // Alerte activité faible (2% de chance)
  if (random > 0.98) {
    alerts.push({
      id: `act_${lot.id}_${Date.now()}`,
      type: 'activity',
      severity: 'warning',
      message_fr: 'Activité des volailles en baisse',
      message_en: 'Poultry activity decreasing',
      value: generateSimulatedData(45, 0.1),
      threshold: 60,
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}

// GET /api/monitoring/lot/:id - Monitoring détaillé d'un lot
router.get('/lot/:id', authenticateToken, requireSubscription(['premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr', period = '24h' } = req.query
    const db = await getDatabase()

    // Vérifier que le lot appartient à l'utilisateur
    const lot = await new Promise((resolve, reject) => {
      db.get(`
        SELECT pl.*, 
          ROUND(CAST((julianday('now') - julianday(pl.start_date)) AS REAL), 0) as days_elapsed
        FROM poultry_lots pl
        WHERE pl.id = ? AND pl.user_id = ?
      `, [id, req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!lot) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Lot non trouvé' : 'Lot not found'
      })
    }

    // Générer des données historiques simulées
    const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720 // 24h, 7d, 30d
    const interval = period === '24h' ? 1 : period === '7d' ? 6 : 24 // Intervalle en heures
    
    const historicalData = []
    for (let i = hours; i >= 0; i -= interval) {
      const timestamp = new Date(Date.now() - i * 60 * 60 * 1000)
      historicalData.push({
        timestamp: timestamp.toISOString(),
        temperature: generateSimulatedData(28, 0.15),
        humidity: generateSimulatedData(65, 0.2),
        ammonia_level: generateSimulatedData(15, 0.3),
        light_intensity: generateSimulatedData(20, 0.25),
        activity_level: Math.floor(generateSimulatedData(80, 0.3)),
        feeding_frequency: Math.floor(generateSimulatedData(45, 0.4)),
        water_consumption: generateSimulatedData(2.5, 0.25)
      })
    }

    // Données actuelles
    const currentData = {
      temperature: generateSimulatedData(28, 0.15),
      humidity: generateSimulatedData(65, 0.2),
      ammonia_level: generateSimulatedData(15, 0.3),
      light_intensity: generateSimulatedData(20, 0.25),
      air_quality_index: Math.floor(generateSimulatedData(75, 0.2)),
      activity_level: Math.floor(generateSimulatedData(80, 0.3)),
      feeding_frequency: Math.floor(generateSimulatedData(45, 0.4)),
      water_consumption_rate: generateSimulatedData(2.5, 0.25),
      stress_indicators: Math.floor(generateSimulatedData(10, 0.5))
    }

    // Dispositifs simulés
    const devices = [
      {
        id: `temp_sensor_${id}`,
        name: lang === 'fr' ? 'Capteur Température' : 'Temperature Sensor',
        type: 'temperature',
        status: 'online',
        battery: Math.floor(generateSimulatedData(85, 0.2)),
        last_update: new Date().toISOString()
      },
      {
        id: `hum_sensor_${id}`,
        name: lang === 'fr' ? 'Capteur Humidité' : 'Humidity Sensor',
        type: 'humidity',
        status: 'online',
        battery: Math.floor(generateSimulatedData(75, 0.3)),
        last_update: new Date().toISOString()
      },
      {
        id: `nh3_sensor_${id}`,
        name: lang === 'fr' ? 'Capteur Ammoniac' : 'Ammonia Sensor',
        type: 'ammonia',
        status: Math.random() > 0.95 ? 'offline' : 'online',
        battery: Math.floor(generateSimulatedData(60, 0.4)),
        last_update: new Date(Date.now() - Math.random() * 300000).toISOString() // Jusqu'à 5min de retard
      },
      {
        id: `camera_${id}`,
        name: lang === 'fr' ? 'Caméra IA' : 'AI Camera',
        type: 'camera',
        status: 'online',
        battery: null, // Alimenté secteur
        last_update: new Date().toISOString()
      }
    ]

    res.json({
      success: true,
      data: {
        lot,
        currentData,
        historicalData,
        devices,
        alerts: generateAlerts(lot),
        recommendations: generateRecommendations(currentData, lang),
        lastUpdate: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur monitoring lot:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du monitoring du lot' : 
        'Error monitoring lot'
    })
  }
})

// Fonction pour générer des recommandations
function generateRecommendations(data, lang = 'fr') {
  const recommendations = []

  if (data.temperature > 30) {
    recommendations.push({
      type: 'environment',
      priority: 'high',
      message_fr: 'Améliorer la ventilation - température trop élevée',
      message_en: 'Improve ventilation - temperature too high',
      action_fr: 'Ouvrir les fenêtres ou augmenter la ventilation mécanique',
      action_en: 'Open windows or increase mechanical ventilation'
    })
  }

  if (data.humidity > 75) {
    recommendations.push({
      type: 'environment',
      priority: 'medium',
      message_fr: 'Réduire l\'humidité dans le bâtiment',
      message_en: 'Reduce humidity in building',
      action_fr: 'Vérifier la ventilation et l\'étanchéité du toit',
      action_en: 'Check ventilation and roof waterproofing'
    })
  }

  if (data.activity_level < 60) {
    recommendations.push({
      type: 'behavior',
      priority: 'high',
      message_fr: 'Activité des volailles anormalement faible',
      message_en: 'Abnormally low poultry activity',
      action_fr: 'Vérifier la santé du cheptel et l\'alimentation',
      action_en: 'Check flock health and feeding'
    })
  }

  return recommendations
}

// GET /api/monitoring/alerts - Récupérer toutes les alertes
router.get('/alerts', authenticateToken, requireSubscription(['premium']), async (req, res) => {
  try {
    const { lang = 'fr', limit = 50 } = req.query
    const db = await getDatabase()

    // Récupérer les lots de l'utilisateur pour générer des alertes
    const userLots = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name FROM poultry_lots
        WHERE user_id = ? AND status = 'active'
      `, [req.user.id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Générer des alertes historiques simulées
    const alerts = []
    const now = Date.now()
    
    for (let i = 0; i < Math.min(limit, 20); i++) {
      const lot = userLots[Math.floor(Math.random() * userLots.length)]
      if (!lot) continue

      const alertTypes = ['temperature', 'humidity', 'ammonia', 'activity', 'feeding']
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const severities = ['info', 'warning', 'critical']
      const severity = severities[Math.floor(Math.random() * severities.length)]
      
      alerts.push({
        id: `alert_${i}_${Date.now()}`,
        lot_id: lot.id,
        lot_name: lot.name,
        type,
        severity,
        timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 derniers jours
        message_fr: getAlertMessage(type, severity, 'fr'),
        message_en: getAlertMessage(type, severity, 'en'),
        acknowledged: Math.random() > 0.7,
        value: generateSimulatedData(getBaseValue(type), 0.3)
      })
    }

    // Trier par timestamp décroissant
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({
      success: true,
      data: alerts.slice(0, limit)
    })
  } catch (error) {
    console.error('Erreur récupération alertes:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des alertes' : 
        'Error retrieving alerts'
    })
  }
})

// Fonctions utilitaires pour les alertes
function getAlertMessage(type, severity, lang) {
  const messages = {
    temperature: {
      fr: {
        info: 'Température normale',
        warning: 'Température élevée détectée',
        critical: 'Température critique - action immédiate requise'
      },
      en: {
        info: 'Normal temperature',
        warning: 'High temperature detected',
        critical: 'Critical temperature - immediate action required'
      }
    },
    humidity: {
      fr: {
        info: 'Humidité dans la normale',
        warning: 'Humidité élevée',
        critical: 'Humidité critique'
      },
      en: {
        info: 'Normal humidity',
        warning: 'High humidity',
        critical: 'Critical humidity'
      }
    },
    activity: {
      fr: {
        info: 'Activité normale',
        warning: 'Activité réduite',
        critical: 'Activité très faible - problème de santé possible'
      },
      en: {
        info: 'Normal activity',
        warning: 'Reduced activity',
        critical: 'Very low activity - possible health issue'
      }
    }
  }

  return messages[type]?.[lang]?.[severity] || `${type} ${severity}`
}

function getBaseValue(type) {
  const baseValues = {
    temperature: 28,
    humidity: 65,
    ammonia: 15,
    activity: 80,
    feeding: 45
  }
  return baseValues[type] || 0
}

// POST /api/monitoring/alerts/:id/acknowledge - Acquitter une alerte
router.post('/alerts/:id/acknowledge', authenticateToken, requireSubscription(['premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query

    // En mode simulation, on accepte toujours
    res.json({
      success: true,
      message: lang === 'fr' ? 'Alerte acquittée' : 'Alert acknowledged'
    })
  } catch (error) {
    console.error('Erreur acquittement alerte:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de l\'acquittement' : 
        'Error acknowledging alert'
    })
  }
})

// GET /api/monitoring/devices - Liste des dispositifs
router.get('/devices', authenticateToken, requireSubscription(['premium']), async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Récupérer les lots actifs
    const activeLots = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name FROM poultry_lots
        WHERE user_id = ? AND status = 'active'
      `, [req.user.id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Générer des dispositifs simulés pour chaque lot
    const devices = []
    activeLots.forEach(lot => {
      const lotDevices = [
        {
          id: `temp_${lot.id}`,
          name: lang === 'fr' ? `Capteur T° - ${lot.name}` : `Temp Sensor - ${lot.name}`,
          type: 'temperature',
          lot_id: lot.id,
          lot_name: lot.name,
          status: Math.random() > 0.05 ? 'online' : 'offline',
          battery: Math.floor(generateSimulatedData(80, 0.3)),
          signal_strength: Math.floor(generateSimulatedData(85, 0.2)),
          last_update: new Date(Date.now() - Math.random() * 300000).toISOString(),
          location: lang === 'fr' ? 'Zone Nord' : 'North Zone'
        },
        {
          id: `hum_${lot.id}`,
          name: lang === 'fr' ? `Capteur Humidité - ${lot.name}` : `Humidity Sensor - ${lot.name}`,
          type: 'humidity',
          lot_id: lot.id,
          lot_name: lot.name,
          status: Math.random() > 0.1 ? 'online' : 'offline',
          battery: Math.floor(generateSimulatedData(75, 0.4)),
          signal_strength: Math.floor(generateSimulatedData(90, 0.15)),
          last_update: new Date(Date.now() - Math.random() * 600000).toISOString(),
          location: lang === 'fr' ? 'Zone Centre' : 'Central Zone'
        },
        {
          id: `cam_${lot.id}`,
          name: lang === 'fr' ? `Caméra IA - ${lot.name}` : `AI Camera - ${lot.name}`,
          type: 'camera',
          lot_id: lot.id,
          lot_name: lot.name,
          status: Math.random() > 0.02 ? 'online' : 'offline',
          battery: null, // Alimenté secteur
          signal_strength: Math.floor(generateSimulatedData(95, 0.1)),
          last_update: new Date(Date.now() - Math.random() * 120000).toISOString(),
          location: lang === 'fr' ? 'Plafond Centre' : 'Ceiling Center'
        }
      ]
      devices.push(...lotDevices)
    })

    res.json({
      success: true,
      data: devices
    })
  } catch (error) {
    console.error('Erreur récupération dispositifs:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des dispositifs' : 
        'Error retrieving devices'
    })
  }
})

export default router
