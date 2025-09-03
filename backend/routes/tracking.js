import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticate, requireSubscription } from '../middleware/auth.js'

const router = express.Router()

// GET /api/tracking/cycles - Récupérer tous les cycles d'un utilisateur
router.get('/cycles', authenticate, async (req, res) => {
  try {
    const db = await getDatabase()
    const userId = req.user.id

    const cycles = await new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM poultry_lots 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `, [userId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json(cycles)
  } catch (error) {
    console.error('Erreur cycles:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/tracking/cycles - Créer un nouveau cycle
router.post('/cycles', authenticate, async (req, res) => {
  try {
    const db = await getDatabase()
    const userId = req.user.id
    const {
      phase,
      duration,
      superficie,
      budget,
      poultryCount,
      estimatedRevenue,
      estimatedProfit
    } = req.body

    const cycleId = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO poultry_lots (
          user_id, name, phase, planned_quantity, 
          superficie, budget, estimated_revenue, estimated_profit,
          planned_duration, status, start_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
      `, [
        userId, 
        `Lot ${phase} - ${new Date().toLocaleDateString()}`,
        phase,
        poultryCount,
        superficie,
        budget,
        estimatedRevenue,
        estimatedProfit,
        duration
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })

    const newCycle = {
      id: cycleId,
      phase,
      duration,
      superficie,
      budget,
      poultryCount,
      estimatedRevenue,
      estimatedProfit,
      startDate: new Date(),
      currentDay: 1,
      isActive: true
    }

    res.status(201).json(newCycle)
  } catch (error) {
    console.error('Erreur création cycle:', error)
    res.status(500).json({ error: 'Erreur création cycle' })
  }
})

// GET /api/tracking/chicken-images/:day - Images du poulet par jour
router.get('/chicken-images/:day', (req, res) => {
  const day = parseInt(req.params.day)
  
  const chickenImages = {
    1: {
      url: '/images/poulet-j1.jpg',
      description: 'Poussin nouveau-né - premier jour',
      weight: '40-45g',
      characteristics: 'Poussin jaune, actif, yeux vifs'
    },
    7: {
      url: '/images/poulet-j7.jpg',
      description: 'Poussin 1 semaine - plumes apparaissent',
      weight: '100-120g',
      characteristics: 'Premières plumes sur les ailes'
    },
    14: {
      url: '/images/poulet-j14.jpg',
      description: 'Poulet 2 semaines - emplumement partiel',
      weight: '300-350g',
      characteristics: 'Plumage se développe, plus de mobilité'
    },
    21: {
      url: '/images/poulet-j21.jpg',
      description: 'Poulet 3 semaines - emplumement avancé',
      weight: '500-600g',
      characteristics: 'Plumage presque complet'
    },
    28: {
      url: '/images/poulet-j28.jpg',
      description: 'Poulet 4 semaines - développement rapide',
      weight: '800-1000g',
      characteristics: 'Croissance musculaire visible'
    },
    35: {
      url: '/images/poulet-j35.jpg',
      description: 'Poulet 5 semaines - pré-finition',
      weight: '1200-1500g',
      characteristics: 'Développement musculaire important'
    },
    42: {
      url: '/images/poulet-j42.jpg',
      description: 'Poulet 6 semaines - prêt pour abattage',
      weight: '2000-2500g',
      characteristics: 'Poids commercial atteint'
    }
  }

  const availableDays = Object.keys(chickenImages).map(Number).sort((a, b) => a - b)
  const closestDay = availableDays.reduce((prev, curr) => 
    Math.abs(curr - day) < Math.abs(prev - day) ? curr : prev
  )

  res.json(chickenImages[closestDay])
})

// GET /api/tracking/daily-tasks/:phase/:day - Tâches quotidiennes
router.get('/daily-tasks/:phase/:day', (req, res) => {
  const { phase, day } = req.params
  const dayNum = parseInt(day)

  const tasksByPhase = {
    demarrage: {
      1: [
        'Réception des poussins (contrôle qualité)',
        'Mise en éleveuse (température 32-35°C)',
        'Distribution eau + glucose (50g/L)',
        'Vaccination Newcastle + Gumboro',
        'Éclairage 24h/24'
      ],
      7: [
        'Pesée échantillon (100g minimum)',
        'Ajustement température (30°C)',
        'Contrôle croissance',
        'Vaccination de rappel si nécessaire'
      ]
    },
    croissance: {
      14: [
        'Changement vers aliment démarrage',
        'Vaccination Newcastle La Sota',
        'Ajustement mangeoires',
        'Contrôle croissance (300g)',
        'Nettoyage litière'
      ],
      21: [
        'Pesée contrôle (500g)',
        'Vaccination Gumboro intermédiaire',
        'Réglage hauteur mangeoires',
        'Contrôle sanitaire renforcé'
      ]
    },
    finition: {
      35: [
        'Changement aliment croissance',
        'Pesée (1.5kg attendu)',
        'Surveillance sanitaire',
        'Optimisation espace'
      ],
      42: [
        'Pesée finale (2-2.5kg)',
        'Arrêt alimentation 12h avant abattage',
        'Préparation enlèvement',
        'Bilan financier'
      ]
    }
  }

  let tasks = []
  
  if (tasksByPhase[phase] && tasksByPhase[phase][dayNum]) {
    tasks = tasksByPhase[phase][dayNum]
  } else {
    tasks = [
      'Contrôle température et ventilation',
      'Vérification abreuvoirs et mangeoires',
      'Observation état général du lot',
      'Élimination des morts',
      'Nettoyage zones souillées'
    ]
  }

  res.json({ day: dayNum, phase, tasks })
})

// POST /api/tracking/calculate-cycle - Calculer un nouveau cycle
router.post('/calculate-cycle', (req, res) => {
  const { phase, superficie, budget } = req.body

  const phases = {
    'demarrage': { duration: 10, density: 30 },
    'croissance': { duration: 24, density: 25 },
    'finition': { duration: 42, density: 20 },
    'complet': { duration: 42, density: 20 }
  }

  const phaseInfo = phases[phase]
  if (!phaseInfo) {
    return res.status(400).json({ error: 'Phase invalide' })
  }

  let calculatedSuperficie = superficie || 0
  let calculatedBudget = budget || 0
  let calculatedPoultry = 0

  if (superficie > 0) {
    calculatedPoultry = Math.floor(superficie * phaseInfo.density)
  } else if (budget > 0) {
    const costPerChicken = 450 + (phaseInfo.duration * 200)
    calculatedPoultry = Math.floor(budget / costPerChicken)
    calculatedSuperficie = Math.ceil(calculatedPoultry / phaseInfo.density)
  }

  if (calculatedBudget === 0 && calculatedPoultry > 0) {
    const costPerChicken = 450 + (phaseInfo.duration * 200)
    calculatedBudget = calculatedPoultry * costPerChicken
  }

  const sellingPricePerKg = 2500
  const avgWeightAtEnd = 2.2
  const totalRevenue = calculatedPoultry * avgWeightAtEnd * sellingPricePerKg
  const estimatedProfit = totalRevenue - calculatedBudget

  const result = {
    phase: phase,
    duration: phaseInfo.duration,
    superficie: calculatedSuperficie,
    budget: calculatedBudget,
    poultryCount: calculatedPoultry,
    estimatedRevenue: totalRevenue,
    estimatedProfit: estimatedProfit
  }

  res.json(result)
})

// GET /api/tracking/lots - Récupérer tous les lots de l'utilisateur
router.get('/lots', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const db = await getDatabase()
    const { lang = 'fr' } = req.query

    const lots = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          pl.*,
          CASE 
            WHEN pl.status = 'active' THEN ${lang === 'fr' ? "'Actif'" : "'Active'"}
            WHEN pl.status = 'finished' THEN ${lang === 'fr' ? "'Terminé'" : "'Finished'"}
            WHEN pl.status = 'planning' THEN ${lang === 'fr' ? "'Planification'" : "'Planning'"}
            ELSE pl.status
          END as status_display,
          ROUND(
            CAST((julianday('now') - julianday(pl.start_date)) AS REAL), 0
          ) as days_elapsed,
          ROUND(
            CAST((pl.planned_duration - (julianday('now') - julianday(pl.start_date))) AS REAL), 0
          ) as days_remaining
        FROM poultry_lots pl
        WHERE pl.user_id = ?
        ORDER BY pl.created_at DESC
      `, [req.user.id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: lots
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des lots:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des lots' : 
        'Error retrieving lots'
    })
  }
})

// POST /api/tracking/lots - Créer un nouveau lot
router.post('/lots', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { 
      name, 
      breed, 
      initial_quantity, 
      start_date, 
      planned_duration, 
      building_info,
      goals 
    } = req.body
    const { lang = 'fr' } = req.query

    if (!name || !breed || !initial_quantity || !start_date) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Nom, race, quantité initiale et date de début sont requis' :
          'Name, breed, initial quantity and start date are required'
      })
    }

    const db = await getDatabase()
    
    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO poultry_lots 
        (user_id, name, breed, initial_quantity, current_quantity, start_date, 
         planned_duration, building_info, goals, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        req.user.id, name, breed, initial_quantity, initial_quantity, 
        start_date, planned_duration || 45, building_info, goals
      ], function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
    })

    res.status(201).json({
      success: true,
      message: lang === 'fr' ? 'Lot créé avec succès' : 'Lot created successfully',
      data: { id: result.id }
    })
  } catch (error) {
    console.error('Erreur lors de la création du lot:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la création du lot' : 
        'Error creating lot'
    })
  }
})

// GET /api/tracking/lots/:id - Récupérer un lot spécifique
router.get('/lots/:id', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const lot = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          pl.*,
          ROUND(
            CAST((julianday('now') - julianday(pl.start_date)) AS REAL), 0
          ) as days_elapsed,
          ROUND(
            CAST((pl.planned_duration - (julianday('now') - julianday(pl.start_date))) AS REAL), 0
          ) as days_remaining
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

    // Récupérer les enregistrements quotidiens
    const dailyRecords = await new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM daily_tracking
        WHERE lot_id = ?
        ORDER BY date DESC
        LIMIT 30
      `, [id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Récupérer les événements sanitaires
    const healthEvents = await new Promise((resolve, reject) => {
      db.all(`
        SELECT he.*, d.name_fr, d.name_en 
        FROM health_events he
        LEFT JOIN diseases d ON he.disease_id = d.id
        WHERE he.lot_id = ?
        ORDER BY he.date DESC
      `, [id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: {
        lot,
        dailyRecords,
        healthEvents
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du lot:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération du lot' : 
        'Error retrieving lot'
    })
  }
})

// POST /api/tracking/lots/:id/daily - Ajouter un enregistrement quotidien
router.post('/lots/:id/daily', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { 
      date, 
      mortality, 
      feed_consumption, 
      weight_sample, 
      water_consumption, 
      temperature, 
      humidity, 
      notes 
    } = req.body
    const { lang = 'fr' } = req.query

    const db = await getDatabase()

    // Vérifier que le lot appartient à l'utilisateur
    const lot = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM poultry_lots WHERE id = ? AND user_id = ?', 
        [id, req.user.id], (err, row) => {
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

    // Insérer l'enregistrement quotidien
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO daily_tracking 
        (lot_id, date, mortality, feed_consumption, weight_sample, 
         water_consumption, temperature, humidity, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, date, mortality || 0, feed_consumption, weight_sample,
        water_consumption, temperature, humidity, notes
      ], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Mettre à jour la quantité actuelle si mortalité
    if (mortality && mortality > 0) {
      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE poultry_lots 
          SET current_quantity = current_quantity - ?
          WHERE id = ?
        `, [mortality, id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    res.json({
      success: true,
      message: lang === 'fr' ? 
        'Enregistrement quotidien ajouté' : 
        'Daily record added'
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'enregistrement:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de l\'ajout de l\'enregistrement' : 
        'Error adding record'
    })
  }
})

// POST /api/tracking/lots/:id/health-event - Ajouter un événement sanitaire
router.post('/lots/:id/health-event', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { 
      date, 
      type, 
      disease_id, 
      affected_quantity, 
      treatment_used, 
      cost, 
      notes 
    } = req.body
    const { lang = 'fr' } = req.query

    const db = await getDatabase()

    // Vérifier que le lot appartient à l'utilisateur
    const lot = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM poultry_lots WHERE id = ? AND user_id = ?', 
        [id, req.user.id], (err, row) => {
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

    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO health_events 
        (lot_id, date, type, disease_id, affected_quantity, treatment_used, cost, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, date, type, disease_id, affected_quantity, 
        treatment_used, cost || 0, notes
      ], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      message: lang === 'fr' ? 
        'Événement sanitaire ajouté' : 
        'Health event added'
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de l\'ajout de l\'événement' : 
        'Error adding health event'
    })
  }
})

// GET /api/tracking/performance/:id - Statistiques de performance d'un lot
router.get('/performance/:id', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Vérifier le lot
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

    // Calculer les statistiques
    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_records,
          SUM(mortality) as total_mortality,
          AVG(weight_sample) as avg_weight,
          SUM(feed_consumption) as total_feed,
          AVG(temperature) as avg_temperature,
          AVG(humidity) as avg_humidity
        FROM daily_tracking
        WHERE lot_id = ?
      `, [id], (err, row) => {
        if (err) reject(err)
        else resolve(row || {})
      })
    })

    // Calculer les indicateurs de performance
    const performance = {
      survival_rate: lot.current_quantity / lot.initial_quantity * 100,
      daily_mortality_rate: (stats.total_mortality || 0) / (lot.days_elapsed || 1),
      feed_conversion_ratio: stats.total_feed / ((stats.avg_weight || 0) * lot.current_quantity),
      avg_daily_gain: (stats.avg_weight || 0) / (lot.days_elapsed || 1),
      days_elapsed: lot.days_elapsed
    }

    // Récupérer les données pour les graphiques
    const chartData = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          date,
          weight_sample,
          mortality,
          feed_consumption,
          temperature,
          humidity
        FROM daily_tracking
        WHERE lot_id = ?
        ORDER BY date ASC
      `, [id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: {
        lot,
        performance,
        stats,
        chartData
      }
    })
  } catch (error) {
    console.error('Erreur lors du calcul des performances:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du calcul des performances' : 
        'Error calculating performance'
    })
  }
})

// PUT /api/tracking/lots/:id - Mettre à jour un lot
router.put('/lots/:id', authenticate, requireSubscription(['pro', 'premium']), async (req, res) => {
  try {
    const { id } = req.params
    const { name, status, goals, building_info } = req.body
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const result = await new Promise((resolve, reject) => {
      db.run(`
        UPDATE poultry_lots 
        SET name = COALESCE(?, name),
            status = COALESCE(?, status),
            goals = COALESCE(?, goals),
            building_info = COALESCE(?, building_info),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `, [name, status, goals, building_info, id, req.user.id], function(err) {
        if (err) reject(err)
        else resolve({ changes: this.changes })
      })
    })

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Lot non trouvé' : 'Lot not found'
      })
    }

    res.json({
      success: true,
      message: lang === 'fr' ? 'Lot mis à jour' : 'Lot updated'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la mise à jour' : 
        'Error updating lot'
    })
  }
})

export default router
