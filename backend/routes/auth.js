import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { getDatabase } from '../database/init.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// User registration
router.post('/signup', [
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('city').notEmpty().withMessage('La ville est requise')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    })
  }

  const { firstName, lastName, email, password, city } = req.body

  const db = await getDatabase()

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (first_name, last_name, email, password_hash, city) 
         VALUES (?, ?, ?, ?, ?)`,
        [firstName, lastName, email, passwordHash, city],
        function(err) {
          if (err) reject(err)
          else resolve({ id: this.lastID })
        }
      )
    })

    // Get created user
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, first_name, last_name, email, role, subscription, city, language, theme FROM users WHERE id = ?',
        [result.id],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        city: user.city,
        language: user.language,
        theme: user.theme
      }
    })
  } finally {
    db.close()
  }
}))

// User login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    })
  }

  const { email, password } = req.body

  const db = await getDatabase()

  try {
    // Get user
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Update last login
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    // Generate token
    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        city: user.city,
        language: user.language,
        theme: user.theme
      }
    })
  } finally {
    db.close()
  }
}))

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      subscription: req.user.subscription,
      city: req.user.city,
      language: req.user.language,
      theme: req.user.theme
    }
  })
}))

// Update user profile
router.put('/profile', authenticate, [
  body('firstName').optional().trim().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('lastName').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('city').optional().notEmpty().withMessage('La ville ne peut pas être vide'),
  body('language').optional().isIn(['fr', 'en']).withMessage('Langue invalide'),
  body('theme').optional().isIn(['light', 'dark']).withMessage('Thème invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    })
  }

  const { firstName, lastName, city, language, theme } = req.body

  const db = await getDatabase()

  try {
    const updates = []
    const values = []

    if (firstName !== undefined) {
      updates.push('first_name = ?')
      values.push(firstName)
    }
    if (lastName !== undefined) {
      updates.push('last_name = ?')
      values.push(lastName)
    }
    if (city !== undefined) {
      updates.push('city = ?')
      values.push(city)
    }
    if (language !== undefined) {
      updates.push('language = ?')
      values.push(language)
    }
    if (theme !== undefined) {
      updates.push('theme = ?')
      values.push(theme)
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      })
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(req.user.id)

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    // Get updated user
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, first_name, last_name, email, role, subscription, city, language, theme FROM users WHERE id = ?',
        [req.user.id],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscription: updatedUser.subscription,
        city: updatedUser.city,
        language: updatedUser.language,
        theme: updatedUser.theme
      }
    })
  } finally {
    db.close()
  }
}))

// Change password
router.put('/password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    })
  }

  const { currentPassword, newPassword } = req.body

  const db = await getDatabase()

  try {
    // Get user with password
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT password_hash FROM users WHERE id = ?',
        [req.user.id],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      })
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPasswordHash, req.user.id],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    })
  } finally {
    db.close()
  }
}))

// Forgot password (placeholder - would need email service)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Email invalide',
      errors: errors.array()
    })
  }

  // For demo purposes, always return success
  // In production, you would:
  // 1. Check if email exists
  // 2. Generate reset token
  // 3. Send email with reset link
  // 4. Store token in database with expiration

  res.json({
    success: true,
    message: 'Si cet email existe, vous recevrez des instructions de réinitialisation'
  })
}))

// Logout (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  })
})

export default router
