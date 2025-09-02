import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken, requireSubscription } from '../middleware/auth.js'

const router = express.Router()

// GET /api/tracking/lots - Récupérer tous les lots de l'utilisateur
router.get('/lots', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.post('/lots', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.get('/lots/:id', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.post('/lots/:id/daily', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.post('/lots/:id/health-event', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.get('/performance/:id', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
router.put('/lots/:id', authenticateToken, requireSubscription(['pro', 'premium']), async (req, res) => {
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
