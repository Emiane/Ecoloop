import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/forum/categories - Récupérer toutes les catégories du forum
router.get('/categories', async (req, res) => {
  try {
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const categories = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          fc.*,
          COUNT(DISTINCT fp.id) as post_count,
          COUNT(DISTINCT fr.id) as reply_count,
          MAX(COALESCE(fr.created_at, fp.created_at)) as last_activity
        FROM forum_categories fc
        LEFT JOIN forum_posts fp ON fc.id = fp.category_id
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        GROUP BY fc.id
        ORDER BY fc.order_priority ASC, fc.name_fr ASC
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: lang === 'fr' ? cat.name_fr : cat.name_en,
      description: lang === 'fr' ? cat.description_fr : cat.description_en,
      color: cat.color,
      post_count: cat.post_count || 0,
      reply_count: cat.reply_count || 0,
      last_activity: cat.last_activity,
      icon: getCategoryIcon(cat.name_en || cat.name_fr)
    }))

    res.json({
      success: true,
      data: formattedCategories
    })
  } catch (error) {
    console.error('Erreur récupération catégories forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des catégories' : 
        'Error retrieving categories'
    })
  }
})

// GET /api/forum/posts - Récupérer les posts du forum
router.get('/posts', async (req, res) => {
  try {
    const { category_id, page = 1, limit = 20, lang = 'fr' } = req.query
    const offset = (page - 1) * limit
    const db = await getDatabase()

    let whereClause = ''
    let params = []
    
    if (category_id) {
      whereClause = 'WHERE fp.category_id = ?'
      params.push(category_id)
    }

    const posts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          fp.*,
          u.first_name,
          u.last_name,
          u.role,
          fc.name_fr as category_name_fr,
          fc.name_en as category_name_en,
          fc.color as category_color,
          COUNT(DISTINCT fr.id) as reply_count,
          MAX(COALESCE(fr.created_at, fp.created_at)) as last_activity,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.post_id = fp.id AND fv.vote_type = 'up') as upvotes,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.post_id = fp.id AND fv.vote_type = 'down') as downvotes
        FROM forum_posts fp
        JOIN users u ON fp.user_id = u.id
        JOIN forum_categories fc ON fp.category_id = fc.id
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        ${whereClause}
        GROUP BY fp.id
        ORDER BY fp.is_pinned DESC, last_activity DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
      author: {
        name: `${post.first_name} ${post.last_name}`,
        role: post.role
      },
      category: {
        id: post.category_id,
        name: lang === 'fr' ? post.category_name_fr : post.category_name_en,
        color: post.category_color
      },
      reply_count: post.reply_count || 0,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      score: (post.upvotes || 0) - (post.downvotes || 0),
      is_pinned: post.is_pinned,
      is_locked: post.is_locked,
      created_at: post.created_at,
      last_activity: post.last_activity
    }))

    // Compter le total pour la pagination
    const total = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM forum_posts fp
        ${whereClause}
      `, params.slice(0, -2), (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Erreur récupération posts forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des posts' : 
        'Error retrieving posts'
    })
  }
})

// GET /api/forum/posts/:id - Récupérer un post spécifique avec ses réponses
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Récupérer le post
    const post = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          fp.*,
          u.first_name,
          u.last_name,
          u.role,
          fc.name_fr as category_name_fr,
          fc.name_en as category_name_en,
          fc.color as category_color,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.post_id = fp.id AND fv.vote_type = 'up') as upvotes,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.post_id = fp.id AND fv.vote_type = 'down') as downvotes
        FROM forum_posts fp
        JOIN users u ON fp.user_id = u.id
        JOIN forum_categories fc ON fp.category_id = fc.id
        WHERE fp.id = ?
      `, [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!post) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Post non trouvé' : 'Post not found'
      })
    }

    // Incrémenter les vues
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE forum_posts 
        SET views = views + 1 
        WHERE id = ?
      `, [id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Récupérer les réponses
    const replies = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          fr.*,
          u.first_name,
          u.last_name,
          u.role,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.reply_id = fr.id AND fv.vote_type = 'up') as upvotes,
          (SELECT COUNT(*) FROM forum_votes fv WHERE fv.reply_id = fr.id AND fv.vote_type = 'down') as downvotes
        FROM forum_replies fr
        JOIN users u ON fr.user_id = u.id
        WHERE fr.post_id = ?
        ORDER BY fr.created_at ASC
      `, [id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.user_id,
        name: `${post.first_name} ${post.last_name}`,
        role: post.role
      },
      category: {
        id: post.category_id,
        name: lang === 'fr' ? post.category_name_fr : post.category_name_en,
        color: post.category_color
      },
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      score: (post.upvotes || 0) - (post.downvotes || 0),
      views: post.views + 1, // +1 pour la vue actuelle
      is_pinned: post.is_pinned,
      is_locked: post.is_locked,
      created_at: post.created_at,
      replies: replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: {
          id: reply.user_id,
          name: `${reply.first_name} ${reply.last_name}`,
          role: reply.role
        },
        upvotes: reply.upvotes || 0,
        downvotes: reply.downvotes || 0,
        score: (reply.upvotes || 0) - (reply.downvotes || 0),
        created_at: reply.created_at
      }))
    }

    res.json({
      success: true,
      data: formattedPost
    })
  } catch (error) {
    console.error('Erreur récupération post forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération du post' : 
        'Error retrieving post'
    })
  }
})

// POST /api/forum/posts - Créer un nouveau post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content, category_id } = req.body
    const { lang = 'fr' } = req.query

    if (!title || !content || !category_id) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Titre, contenu et catégorie sont requis' :
          'Title, content and category are required'
      })
    }

    const db = await getDatabase()

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO forum_posts 
        (user_id, category_id, title, content)
        VALUES (?, ?, ?, ?)
      `, [req.user.id, category_id, title, content], function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
    })

    res.status(201).json({
      success: true,
      message: lang === 'fr' ? 'Post créé avec succès' : 'Post created successfully',
      data: { id: result.id }
    })
  } catch (error) {
    console.error('Erreur création post forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la création du post' : 
        'Error creating post'
    })
  }
})

// POST /api/forum/posts/:id/replies - Répondre à un post
router.post('/posts/:id/replies', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    const { lang = 'fr' } = req.query

    if (!content) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Le contenu est requis' : 'Content is required'
      })
    }

    const db = await getDatabase()

    // Vérifier que le post existe et n'est pas verrouillé
    const post = await new Promise((resolve, reject) => {
      db.get('SELECT id, is_locked FROM forum_posts WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!post) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Post non trouvé' : 'Post not found'
      })
    }

    if (post.is_locked) {
      return res.status(403).json({
        success: false,
        message: lang === 'fr' ? 'Ce post est verrouillé' : 'This post is locked'
      })
    }

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO forum_replies 
        (user_id, post_id, content)
        VALUES (?, ?, ?)
      `, [req.user.id, id, content], function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
    })

    res.status(201).json({
      success: true,
      message: lang === 'fr' ? 'Réponse ajoutée avec succès' : 'Reply added successfully',
      data: { id: result.id }
    })
  } catch (error) {
    console.error('Erreur création réponse forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la création de la réponse' : 
        'Error creating reply'
    })
  }
})

// POST /api/forum/vote - Voter pour un post ou une réponse
router.post('/vote', authenticateToken, async (req, res) => {
  try {
    const { post_id, reply_id, vote_type } = req.body
    const { lang = 'fr' } = req.query

    if (!vote_type || !['up', 'down'].includes(vote_type)) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Type de vote invalide' : 'Invalid vote type'
      })
    }

    if (!post_id && !reply_id) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Post ou réponse requis' : 'Post or reply required'
      })
    }

    const db = await getDatabase()

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await new Promise((resolve, reject) => {
      const params = [req.user.id]
      let whereClause = 'user_id = ?'
      
      if (post_id) {
        whereClause += ' AND post_id = ?'
        params.push(post_id)
      } else {
        whereClause += ' AND reply_id = ?'
        params.push(reply_id)
      }

      db.get(`SELECT id, vote_type FROM forum_votes WHERE ${whereClause}`, 
        params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Retirer le vote
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM forum_votes WHERE id = ?', [existingVote.id], (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
        
        res.json({
          success: true,
          message: lang === 'fr' ? 'Vote retiré' : 'Vote removed'
        })
      } else {
        // Changer le vote
        await new Promise((resolve, reject) => {
          db.run('UPDATE forum_votes SET vote_type = ? WHERE id = ?', 
            [vote_type, existingVote.id], (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
        
        res.json({
          success: true,
          message: lang === 'fr' ? 'Vote modifié' : 'Vote changed'
        })
      }
    } else {
      // Nouveau vote
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO forum_votes 
          (user_id, post_id, reply_id, vote_type)
          VALUES (?, ?, ?, ?)
        `, [req.user.id, post_id, reply_id, vote_type], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      
      res.json({
        success: true,
        message: lang === 'fr' ? 'Vote enregistré' : 'Vote recorded'
      })
    }
  } catch (error) {
    console.error('Erreur vote forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du vote' : 
        'Error voting'
    })
  }
})

// GET /api/forum/search - Rechercher dans le forum
router.get('/search', async (req, res) => {
  try {
    const { q, category_id, lang = 'fr', page = 1, limit = 20 } = req.query
    
    if (!q || q.length < 3) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 
          'Requête de recherche trop courte (minimum 3 caractères)' :
          'Search query too short (minimum 3 characters)'
      })
    }

    const offset = (page - 1) * limit
    const db = await getDatabase()

    let whereClause = 'WHERE (fp.title LIKE ? OR fp.content LIKE ?)'
    let params = [`%${q}%`, `%${q}%`]
    
    if (category_id) {
      whereClause += ' AND fp.category_id = ?'
      params.push(category_id)
    }

    const results = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          fp.*,
          u.first_name,
          u.last_name,
          fc.name_fr as category_name_fr,
          fc.name_en as category_name_en,
          fc.color as category_color,
          COUNT(DISTINCT fr.id) as reply_count
        FROM forum_posts fp
        JOIN users u ON fp.user_id = u.id
        JOIN forum_categories fc ON fp.category_id = fc.id
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        ${whereClause}
        GROUP BY fp.id
        ORDER BY fp.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    const formattedResults = results.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
      author: {
        name: `${post.first_name} ${post.last_name}`
      },
      category: {
        id: post.category_id,
        name: lang === 'fr' ? post.category_name_fr : post.category_name_en,
        color: post.category_color
      },
      reply_count: post.reply_count || 0,
      created_at: post.created_at
    }))

    res.json({
      success: true,
      data: {
        results: formattedResults,
        query: q,
        total: formattedResults.length
      }
    })
  } catch (error) {
    console.error('Erreur recherche forum:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la recherche' : 
        'Error during search'
    })
  }
})

// Fonction utilitaire pour les icônes de catégories
function getCategoryIcon(categoryName) {
  const iconMap = {
    'General Questions': 'MessageCircle',
    'Questions Générales': 'MessageCircle',
    'Health Issues': 'Heart',
    'Problèmes Sanitaires': 'Heart',
    'Business & Sales': 'TrendingUp',
    'Business & Ventes': 'TrendingUp',
    'Equipment': 'Settings',
    'Équipements': 'Settings',
    'Feeding': 'Coffee',
    'Alimentation': 'Coffee',
    'Housing': 'Home',
    'Logement': 'Home'
  }
  
  return iconMap[categoryName] || 'MessageSquare'
}

export default router
