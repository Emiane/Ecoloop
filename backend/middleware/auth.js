import jwt from 'jsonwebtoken'
import { getDatabase } from '../database/init.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from database
      const db = await getDatabase()
      
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT id, first_name, last_name, email, role, subscription, city, language, theme FROM users WHERE id = ?',
          [decoded.id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          }
        )
      })

      db.close()

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        })
      }

      req.user = user
      next()
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    })
  }
}

export const requireSubscription = (requiredLevel) => {
  return (req, res, next) => {
    const userLevel = req.user?.subscription || 'free'
    const levels = ['free', 'pro', 'premium']
    
    const userLevelIndex = levels.indexOf(userLevel)
    const requiredLevelIndex = levels.indexOf(requiredLevel)
    
    if (userLevelIndex < requiredLevelIndex) {
      return res.status(403).json({
        success: false,
        message: `Abonnement ${requiredLevel.toUpperCase()} requis`,
        requiredSubscription: requiredLevel,
        currentSubscription: userLevel
      })
    }
    
    next()
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    })
  }
  next()
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      })
    }
    
    if (Array.isArray(roles)) {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Droits insuffisants'
        })
      }
    } else {
      if (req.user.role !== roles) {
        return res.status(403).json({
          success: false,
          message: 'Droits insuffisants'
        })
      }
    }
    
    next()
  }
}

// Alias pour compatibilité
export const authenticateToken = authenticate
