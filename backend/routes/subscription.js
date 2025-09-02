import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Plans d'abonnement
const subscriptionPlans = {
  free: {
    id: 'free',
    name_fr: 'Gratuit',
    name_en: 'Free',
    price_fcfa: 0,
    price_usd: 0,
    duration_months: 0,
    features: {
      training_basic: true,
      training_premium: false,
      tracking: false,
      monitoring: false,
      forum: true,
      chatbot: true,
      support: 'community',
      max_lots: 0,
      analytics: false
    }
  },
  pro: {
    id: 'pro',
    name_fr: 'Pro',
    name_en: 'Pro',
    price_fcfa: 15000,
    price_usd: 25,
    duration_months: 1,
    features: {
      training_basic: true,
      training_premium: false,
      tracking: true,
      monitoring: false,
      forum: true,
      chatbot: true,
      support: 'email',
      max_lots: 5,
      analytics: true
    }
  },
  premium: {
    id: 'premium',
    name_fr: 'Premium',
    name_en: 'Premium',
    price_fcfa: 25000,
    price_usd: 42,
    duration_months: 1,
    features: {
      training_basic: true,
      training_premium: true,
      tracking: true,
      monitoring: true,
      forum: true,
      chatbot: true,
      support: 'priority',
      max_lots: 999,
      analytics: true
    }
  }
}

// GET /api/subscription/plans - Récupérer tous les plans
router.get('/plans', async (req, res) => {
  try {
    const { lang = 'fr' } = req.query

    const plans = Object.values(subscriptionPlans).map(plan => ({
      ...plan,
      name: lang === 'fr' ? plan.name_fr : plan.name_en,
      price: plan.price_fcfa,
      currency: 'FCFA'
    }))

    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Erreur récupération plans:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des plans' : 
        'Error retrieving plans'
    })
  }
})

// GET /api/subscription/current - Récupérer l'abonnement actuel de l'utilisateur
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const user = await new Promise((resolve, reject) => {
      db.get(`
        SELECT subscription, subscription_expires_at, subscription_auto_renew
        FROM users
        WHERE id = ?
      `, [req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    const currentPlan = subscriptionPlans[user.subscription] || subscriptionPlans.free

    // Vérifier si l'abonnement a expiré
    const now = new Date()
    const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at) : null
    const isExpired = expiresAt && now > expiresAt

    if (isExpired && user.subscription !== 'free') {
      // Rétrograder vers le plan gratuit
      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE users 
          SET subscription = 'free', subscription_expires_at = NULL
          WHERE id = ?
        `, [req.user.id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      
      user.subscription = 'free'
      user.subscription_expires_at = null
    }

    res.json({
      success: true,
      data: {
        current_plan: user.subscription,
        plan_details: {
          ...currentPlan,
          name: lang === 'fr' ? currentPlan.name_fr : currentPlan.name_en
        },
        expires_at: user.subscription_expires_at,
        auto_renew: user.subscription_auto_renew,
        is_expired: isExpired,
        days_remaining: expiresAt ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : null
      }
    })
  } catch (error) {
    console.error('Erreur récupération abonnement actuel:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération de l\'abonnement' : 
        'Error retrieving subscription'
    })
  }
})

// POST /api/subscription/upgrade - Upgrade d'abonnement
router.post('/upgrade', authenticateToken, async (req, res) => {
  try {
    const { plan_id, payment_method } = req.body
    const { lang = 'fr' } = req.query

    if (!plan_id || !subscriptionPlans[plan_id]) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Plan d\'abonnement invalide' : 'Invalid subscription plan'
      })
    }

    if (plan_id === 'free') {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Impossible de passer au plan gratuit par upgrade' : 
          'Cannot upgrade to free plan'
      })
    }

    const plan = subscriptionPlans[plan_id]
    const db = await getDatabase()

    // Simulation du processus de paiement
    const paymentSuccess = await simulatePayment(plan, payment_method)
    
    if (!paymentSuccess.success) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Échec du paiement: ' + paymentSuccess.error :
          'Payment failed: ' + paymentSuccess.error
      })
    }

    // Calculer la date d'expiration
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + plan.duration_months)

    // Mettre à jour l'abonnement
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users 
        SET 
          subscription = ?,
          subscription_expires_at = ?,
          subscription_auto_renew = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [plan_id, expiresAt.toISOString(), req.user.id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Enregistrer la transaction
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO subscription_transactions 
        (user_id, plan_id, amount_fcfa, payment_method, status, transaction_id)
        VALUES (?, ?, ?, ?, 'completed', ?)
      `, [
        req.user.id, plan_id, plan.price_fcfa, 
        payment_method, paymentSuccess.transaction_id
      ], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      message: lang === 'fr' ? 
        `Abonnement ${plan.name_fr} activé avec succès !` :
        `${plan.name_en} subscription activated successfully!`,
      data: {
        plan_id,
        expires_at: expiresAt.toISOString(),
        transaction_id: paymentSuccess.transaction_id
      }
    })
  } catch (error) {
    console.error('Erreur upgrade abonnement:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de l\'upgrade' : 
        'Error during upgrade'
    })
  }
})

// POST /api/subscription/downgrade - Downgrade d'abonnement
router.post('/downgrade', authenticateToken, async (req, res) => {
  try {
    const { confirm } = req.body
    const { lang = 'fr' } = req.query

    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Confirmation requise pour le downgrade' : 
          'Confirmation required for downgrade'
      })
    }

    const db = await getDatabase()

    // Mettre à jour vers le plan gratuit
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users 
        SET 
          subscription = 'free',
          subscription_expires_at = NULL,
          subscription_auto_renew = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [req.user.id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      message: lang === 'fr' ? 
        'Abonnement supprimé. Vous êtes maintenant sur le plan gratuit.' :
        'Subscription canceled. You are now on the free plan.'
    })
  } catch (error) {
    console.error('Erreur downgrade abonnement:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du downgrade' : 
        'Error during downgrade'
    })
  }
})

// GET /api/subscription/history - Historique des transactions
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, lang = 'fr' } = req.query
    const offset = (page - 1) * limit
    const db = await getDatabase()

    const transactions = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          st.*,
          CASE 
            WHEN st.plan_id = 'pro' THEN ${lang === 'fr' ? "'Pro'" : "'Pro'"}
            WHEN st.plan_id = 'premium' THEN ${lang === 'fr' ? "'Premium'" : "'Premium'"}
            ELSE st.plan_id
          END as plan_name
        FROM subscription_transactions st
        WHERE st.user_id = ?
        ORDER BY st.created_at DESC
        LIMIT ? OFFSET ?
      `, [req.user.id, limit, offset], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const total = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM subscription_transactions
        WHERE user_id = ?
      `, [req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Erreur historique abonnements:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération de l\'historique' : 
        'Error retrieving history'
    })
  }
})

// POST /api/subscription/auto-renew - Activer/désactiver le renouvellement automatique
router.post('/auto-renew', authenticateToken, async (req, res) => {
  try {
    const { enabled } = req.body
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users 
        SET subscription_auto_renew = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [enabled ? 1 : 0, req.user.id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      message: lang === 'fr' ? 
        (enabled ? 'Renouvellement automatique activé' : 'Renouvellement automatique désactivé') :
        (enabled ? 'Auto-renewal enabled' : 'Auto-renewal disabled')
    })
  } catch (error) {
    console.error('Erreur auto-renew:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la modification du renouvellement' : 
        'Error updating auto-renewal'
    })
  }
})

// GET /api/subscription/features - Vérifier les fonctionnalités disponibles
router.get('/features', authenticateToken, async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const user = await new Promise((resolve, reject) => {
      db.get(`
        SELECT subscription, subscription_expires_at
        FROM users
        WHERE id = ?
      `, [req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    // Vérifier si l'abonnement a expiré
    const now = new Date()
    const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at) : null
    const isExpired = expiresAt && now > expiresAt

    const effectiveSubscription = isExpired ? 'free' : user.subscription
    const plan = subscriptionPlans[effectiveSubscription] || subscriptionPlans.free

    // Compter les lots actuels pour vérifier la limite
    const currentLots = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM poultry_lots
        WHERE user_id = ? AND status = 'active'
      `, [req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    const features = {
      ...plan.features,
      current_lots: currentLots,
      can_create_lot: currentLots < plan.features.max_lots || plan.features.max_lots === 999
    }

    res.json({
      success: true,
      data: {
        subscription: effectiveSubscription,
        features,
        is_expired: isExpired
      }
    })
  } catch (error) {
    console.error('Erreur vérification fonctionnalités:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la vérification des fonctionnalités' : 
        'Error checking features'
    })
  }
})

// POST /api/subscription/gift - Offrir un abonnement (admin uniquement)
router.post('/gift', authenticateToken, async (req, res) => {
  try {
    const { user_email, plan_id, duration_months = 1 } = req.body
    const { lang = 'fr' } = req.query

    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: lang === 'fr' ? 'Accès refusé' : 'Access denied'
      })
    }

    if (!user_email || !plan_id || !subscriptionPlans[plan_id]) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Email et plan valide requis' : 'Valid email and plan required'
      })
    }

    const db = await getDatabase()

    // Trouver l'utilisateur
    const targetUser = await new Promise((resolve, reject) => {
      db.get('SELECT id, first_name, last_name FROM users WHERE email = ?', 
        [user_email], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Utilisateur non trouvé' : 'User not found'
      })
    }

    const plan = subscriptionPlans[plan_id]
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + duration_months)

    // Mettre à jour l'abonnement
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users 
        SET 
          subscription = ?,
          subscription_expires_at = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [plan_id, expiresAt.toISOString(), targetUser.id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Enregistrer la transaction cadeau
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO subscription_transactions 
        (user_id, plan_id, amount_fcfa, payment_method, status, transaction_id, notes)
        VALUES (?, ?, 0, 'gift', 'completed', ?, ?)
      `, [
        targetUser.id, plan_id, 
        `gift_${Date.now()}`,
        `Cadeau offert par admin ${req.user.id}`
      ], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      message: lang === 'fr' ? 
        `Abonnement ${plan.name_fr} offert à ${targetUser.first_name} ${targetUser.last_name}` :
        `${plan.name_en} subscription gifted to ${targetUser.first_name} ${targetUser.last_name}`,
      data: {
        recipient: `${targetUser.first_name} ${targetUser.last_name}`,
        plan_id,
        expires_at: expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur cadeau abonnement:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de l\'attribution du cadeau' : 
        'Error gifting subscription'
    })
  }
})

// Fonction de simulation de paiement
async function simulatePayment(plan, paymentMethod) {
  // Simulation avec 95% de chance de succès
  await new Promise(resolve => setTimeout(resolve, 1000)) // Délai simulé
  
  const success = Math.random() > 0.05
  
  if (success) {
    return {
      success: true,
      transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: plan.price_fcfa,
      currency: 'FCFA',
      method: paymentMethod
    }
  } else {
    const errors = [
      'Fonds insuffisants',
      'Carte expirée',
      'Erreur réseau',
      'Transaction refusée par la banque'
    ]
    return {
      success: false,
      error: errors[Math.floor(Math.random() * errors.length)]
    }
  }
}

export default router
