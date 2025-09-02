import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

// Get training categories
router.get('/categories', asyncHandler(async (req, res) => {
  const db = await getDatabase()
  
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all(
        'SELECT DISTINCT category FROM training_content ORDER BY category',
        [],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    res.json({
      success: true,
      categories: categories.map(row => row.category)
    })
  } finally {
    db.close()
  }
}))

// Get training content by category
router.get('/content/:category', asyncHandler(async (req, res) => {
  const { category } = req.params
  const language = req.query.lang || 'fr'
  
  const db = await getDatabase()
  
  try {
    const content = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id, 
          category,
          ${language === 'en' ? 'title_en as title' : 'title_fr as title'},
          ${language === 'en' ? 'summary_en as summary' : 'summary_fr as summary'},
          ${language === 'en' ? 'content_en as content' : 'content_fr as content'},
          image_url,
          video_url,
          pdf_url,
          is_premium,
          created_at
        FROM training_content 
        WHERE category = ? 
        ORDER BY order_index, created_at`,
        [category],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    res.json({
      success: true,
      content
    })
  } finally {
    db.close()
  }
}))

// Get diseases information
router.get('/diseases', asyncHandler(async (req, res) => {
  const language = req.query.lang || 'fr'
  
  const db = await getDatabase()
  
  try {
    const diseases = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id,
          ${language === 'en' ? 'name_en as name' : 'name_fr as name'},
          category,
          ${language === 'en' ? 'symptoms_early_en as symptoms_early' : 'symptoms_early_fr as symptoms_early'},
          ${language === 'en' ? 'symptoms_advanced_en as symptoms_advanced' : 'symptoms_advanced_fr as symptoms_advanced'},
          ${language === 'en' ? 'treatment_en as treatment' : 'treatment_fr as treatment'},
          ${language === 'en' ? 'prevention_en as prevention' : 'prevention_fr as prevention'},
          cost_fcfa,
          phases_at_risk,
          severity,
          images
        FROM diseases 
        ORDER BY severity DESC, name`,
        [],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows.map(row => ({
            ...row,
            phases_at_risk: row.phases_at_risk ? row.phases_at_risk.split(',') : [],
            images: row.images ? JSON.parse(row.images) : []
          })))
        }
      )
    })

    res.json({
      success: true,
      diseases
    })
  } finally {
    db.close()
  }
}))

// Get vaccination schedule
router.get('/vaccination', asyncHandler(async (req, res) => {
  const language = req.query.lang || 'fr'
  
  const db = await getDatabase()
  
  try {
    const schedule = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id,
          day,
          vaccine_name,
          disease_target,
          administration_method,
          dosage,
          cost_fcfa,
          ${language === 'en' ? 'notes_en as notes' : 'notes_fr as notes'},
          is_mandatory
        FROM vaccination_schedule 
        ORDER BY day`,
        [],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })

    res.json({
      success: true,
      schedule
    })
  } finally {
    db.close()
  }
}))

export default router
