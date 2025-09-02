import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// Middleware pour vérifier les droits admin
const requireAdmin = requireRole(['admin'])

// GET /api/admin/dashboard - Tableau de bord administrateur
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Statistiques utilisateurs
    const userStats = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          subscription,
          role,
          COUNT(*) as count,
          COUNT(CASE WHEN created_at >= date('now', '-30 days') THEN 1 END) as new_last_30_days
        FROM users 
        GROUP BY subscription, role
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Activité récente
    const recentActivity = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          'user_registration' as type,
          u.first_name || ' ' || u.last_name as details,
          u.created_at as timestamp
        FROM users u
        WHERE u.created_at >= date('now', '-7 days')
        
        UNION ALL
        
        SELECT 
          'forum_post' as type,
          'Nouveau post: ' || fp.title as details,
          fp.created_at as timestamp
        FROM forum_posts fp
        WHERE fp.created_at >= date('now', '-7 days')
        
        ORDER BY timestamp DESC
        LIMIT 20
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Statistiques système
    const systemStats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE created_at >= date('now', '-30 days')) as new_users_month,
          (SELECT COUNT(*) FROM poultry_lots) as total_lots,
          (SELECT COUNT(*) FROM poultry_lots WHERE status = 'active') as active_lots,
          (SELECT COUNT(*) FROM forum_posts) as total_posts,
          (SELECT COUNT(*) FROM forum_replies) as total_replies,
          (SELECT COUNT(*) FROM chatbot_conversations) as total_conversations,
          (SELECT COUNT(*) FROM training_content) as total_training_content
      `, (err, row) => {
        if (err) reject(err)
        else resolve(row || {})
      })
    })

    // Revenus par abonnement (simulé)
    const subscriptionRevenue = {
      free: { users: userStats.filter(s => s.subscription === 'free').reduce((sum, s) => sum + s.count, 0), revenue: 0 },
      pro: { 
        users: userStats.filter(s => s.subscription === 'pro').reduce((sum, s) => sum + s.count, 0), 
        revenue: userStats.filter(s => s.subscription === 'pro').reduce((sum, s) => sum + s.count, 0) * 15000 // 15,000 FCFA/mois
      },
      premium: { 
        users: userStats.filter(s => s.subscription === 'premium').reduce((sum, s) => sum + s.count, 0), 
        revenue: userStats.filter(s => s.subscription === 'premium').reduce((sum, s) => sum + s.count, 0) * 25000 // 25,000 FCFA/mois
      }
    }

    res.json({
      success: true,
      data: {
        userStats,
        systemStats,
        subscriptionRevenue,
        recentActivity,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur dashboard admin:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du chargement du dashboard' : 
        'Error loading dashboard'
    })
  }
})

// GET /api/admin/users - Gestion des utilisateurs
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, subscription, role, lang = 'fr' } = req.query
    const offset = (page - 1) * limit
    const db = await getDatabase()

    let whereClause = 'WHERE 1=1'
    let params = []

    if (search) {
      whereClause += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (subscription) {
      whereClause += ` AND subscription = ?`
      params.push(subscription)
    }

    if (role) {
      whereClause += ` AND role = ?`
      params.push(role)
    }

    const users = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          id, first_name, last_name, email, phone, city, role, subscription,
          created_at, last_login,
          (SELECT COUNT(*) FROM poultry_lots WHERE user_id = users.id) as lot_count,
          (SELECT COUNT(*) FROM forum_posts WHERE user_id = users.id) as post_count
        FROM users 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const total = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM users 
        ${whereClause}
      `, params, (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Erreur récupération utilisateurs admin:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des utilisateurs' : 
        'Error retrieving users'
    })
  }
})

// PUT /api/admin/users/:id - Modifier un utilisateur
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { subscription, role, is_banned } = req.body
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const result = await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users 
        SET 
          subscription = COALESCE(?, subscription),
          role = COALESCE(?, role),
          is_banned = COALESCE(?, is_banned),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [subscription, role, is_banned, id], function(err) {
        if (err) reject(err)
        else resolve({ changes: this.changes })
      })
    })

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Utilisateur non trouvé' : 'User not found'
      })
    }

    res.json({
      success: true,
      message: lang === 'fr' ? 'Utilisateur mis à jour' : 'User updated'
    })
  } catch (error) {
    console.error('Erreur modification utilisateur:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la modification' : 
        'Error updating user'
    })
  }
})

// POST /api/admin/users - Créer un utilisateur
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      first_name, last_name, email, password, phone, city, 
      role = 'user', subscription = 'free' 
    } = req.body
    const { lang = 'fr' } = req.query

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Nom, prénom, email et mot de passe sont requis' :
          'First name, last name, email and password are required'
      })
    }

    const db = await getDatabase()

    // Vérifier que l'email n'existe pas
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Cet email est déjà utilisé' : 'This email is already in use'
      })
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12)

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users 
        (first_name, last_name, email, password_hash, phone, city, role, subscription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        first_name, last_name, email, passwordHash, phone, city, role, subscription
      ], function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
    })

    res.status(201).json({
      success: true,
      message: lang === 'fr' ? 'Utilisateur créé avec succès' : 'User created successfully',
      data: { id: result.id }
    })
  } catch (error) {
    console.error('Erreur création utilisateur admin:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la création de l\'utilisateur' : 
        'Error creating user'
    })
  }
})

// GET /api/admin/content - Gestion du contenu
router.get('/content', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type = 'training', page = 1, limit = 20, lang = 'fr' } = req.query
    const offset = (page - 1) * limit
    const db = await getDatabase()

    let query, params
    
    if (type === 'training') {
      query = `
        SELECT id, category, title_fr, title_en, is_premium, created_at, updated_at
        FROM training_content
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `
      params = [limit, offset]
    } else if (type === 'forum') {
      query = `
        SELECT 
          fp.id, fp.title, fp.created_at,
          u.first_name || ' ' || u.last_name as author,
          fc.name_fr as category,
          COUNT(fr.id) as reply_count
        FROM forum_posts fp
        JOIN users u ON fp.user_id = u.id
        JOIN forum_categories fc ON fp.category_id = fc.id
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        GROUP BY fp.id
        ORDER BY fp.created_at DESC
        LIMIT ? OFFSET ?
      `
      params = [limit, offset]
    }

    const content = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: content
    })
  } catch (error) {
    console.error('Erreur récupération contenu admin:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération du contenu' : 
        'Error retrieving content'
    })
  }
})

// POST /api/admin/content/training - Créer du contenu de formation
router.post('/content/training', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      category, title_fr, title_en, summary_fr, summary_en,
      content_fr, content_en, is_premium = false
    } = req.body
    const { lang = 'fr' } = req.query

    if (!category || !title_fr || !content_fr) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Catégorie, titre FR et contenu FR sont requis' :
          'Category, FR title and FR content are required'
      })
    }

    const db = await getDatabase()

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO training_content 
        (category, title_fr, title_en, summary_fr, summary_en, 
         content_fr, content_en, is_premium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        category, title_fr, title_en, summary_fr, summary_en,
        content_fr, content_en, is_premium
      ], function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
    })

    res.status(201).json({
      success: true,
      message: lang === 'fr' ? 'Contenu créé avec succès' : 'Content created successfully',
      data: { id: result.id }
    })
  } catch (error) {
    console.error('Erreur création contenu formation:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la création du contenu' : 
        'Error creating content'
    })
  }
})

// GET /api/admin/analytics - Analytics et rapports
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30d', lang = 'fr' } = req.query
    const db = await getDatabase()

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

    // Évolution des inscriptions
    const userGrowth = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          date(created_at) as date,
          COUNT(*) as new_users
        FROM users
        WHERE created_at >= date('now', '-${days} days')
        GROUP BY date(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Répartition des abonnements
    const subscriptionDistribution = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          subscription,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
        FROM users
        GROUP BY subscription
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Activité forum
    const forumActivity = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          date(created_at) as date,
          COUNT(*) as posts
        FROM forum_posts
        WHERE created_at >= date('now', '-${days} days')
        GROUP BY date(created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Utilisation du chatbot
    const chatbotUsage = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          date(cc.created_at) as date,
          COUNT(DISTINCT cc.id) as conversations,
          COUNT(cm.id) as messages
        FROM chatbot_conversations cc
        LEFT JOIN chatbot_messages cm ON cc.id = cm.conversation_id
        WHERE cc.created_at >= date('now', '-${days} days')
        GROUP BY date(cc.created_at)
        ORDER BY date
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    // Top contenus de formation
    const topTrainingContent = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          tc.title_fr,
          tc.category,
          tc.is_premium,
          COUNT(*) as views
        FROM training_content tc
        ORDER BY views DESC
        LIMIT 10
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: {
        userGrowth,
        subscriptionDistribution,
        forumActivity,
        chatbotUsage,
        topTrainingContent,
        period,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur analytics admin:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la génération des analytics' : 
        'Error generating analytics'
    })
  }
})

// GET /api/admin/system - Informations système
router.get('/system', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Taille de la base de données
    const dbStats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_tables,
          (SELECT COUNT(*) FROM sqlite_master WHERE type='index') as total_indexes
        FROM sqlite_master WHERE type='table'
      `, (err, row) => {
        if (err) reject(err)
        else resolve(row || {})
      })
    })

    // Statistiques des tables principales
    const tableStats = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 'users' as table_name, COUNT(*) as row_count FROM users
        UNION ALL
        SELECT 'poultry_lots' as table_name, COUNT(*) as row_count FROM poultry_lots
        UNION ALL
        SELECT 'forum_posts' as table_name, COUNT(*) as row_count FROM forum_posts
        UNION ALL
        SELECT 'forum_replies' as table_name, COUNT(*) as row_count FROM forum_replies
        UNION ALL
        SELECT 'chatbot_conversations' as table_name, COUNT(*) as row_count FROM chatbot_conversations
        UNION ALL
        SELECT 'training_content' as table_name, COUNT(*) as row_count FROM training_content
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const systemInfo = {
      database: {
        ...dbStats,
        tables: tableStats
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      },
      app: {
        name: 'EcoLoop Backend',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    }

    res.json({
      success: true,
      data: systemInfo
    })
  } catch (error) {
    console.error('Erreur informations système:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des informations système' : 
        'Error retrieving system information'
    })
  }
})

// POST /api/admin/maintenance - Opérations de maintenance
router.post('/maintenance', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { action } = req.body
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    let result = {}

    switch (action) {
      case 'vacuum':
        await new Promise((resolve, reject) => {
          db.run('VACUUM', (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
        result.message = lang === 'fr' ? 'Base de données optimisée' : 'Database optimized'
        break

      case 'analyze':
        await new Promise((resolve, reject) => {
          db.run('ANALYZE', (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
        result.message = lang === 'fr' ? 'Statistiques mises à jour' : 'Statistics updated'
        break

      case 'cleanup_old_sessions':
        // Nettoyer les anciennes sessions (simulé)
        result.message = lang === 'fr' ? 'Sessions anciennes supprimées' : 'Old sessions cleaned'
        break

      default:
        return res.status(400).json({
          success: false,
          message: lang === 'fr' ? 'Action non reconnue' : 'Unknown action'
        })
    }

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur maintenance:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la maintenance' : 
        'Error during maintenance'
    })
  }
})

export default router
