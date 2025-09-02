import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'ecoloop.db')

export function getDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

export async function initializeDatabase() {
  const db = await getDatabase()
  
  // Enable foreign keys
  await new Promise((resolve, reject) => {
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  // Create tables
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      city TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      subscription TEXT DEFAULT 'free' CHECK(subscription IN ('free', 'pro', 'premium')),
      subscription_expires_at DATETIME,
      profile_image TEXT,
      language TEXT DEFAULT 'fr' CHECK(language IN ('fr', 'en')),
      theme TEXT DEFAULT 'light' CHECK(theme IN ('light', 'dark')),
      email_verified BOOLEAN DEFAULT FALSE,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Training content table
    `CREATE TABLE IF NOT EXISTS training_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title_fr TEXT NOT NULL,
      title_en TEXT NOT NULL,
      summary_fr TEXT,
      summary_en TEXT,
      content_fr TEXT NOT NULL,
      content_en TEXT NOT NULL,
      image_url TEXT,
      video_url TEXT,
      pdf_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_premium BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Disease information table
    `CREATE TABLE IF NOT EXISTS diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_fr TEXT NOT NULL,
      name_en TEXT NOT NULL,
      category TEXT NOT NULL,
      symptoms_early_fr TEXT,
      symptoms_early_en TEXT,
      symptoms_advanced_fr TEXT,
      symptoms_advanced_en TEXT,
      treatment_fr TEXT,
      treatment_en TEXT,
      prevention_fr TEXT,
      prevention_en TEXT,
      cost_fcfa INTEGER,
      phases_at_risk TEXT,
      severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
      images TEXT, -- JSON array of image URLs
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Equipment information table
    `CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_fr TEXT NOT NULL,
      name_en TEXT NOT NULL,
      category TEXT NOT NULL,
      description_fr TEXT,
      description_en TEXT,
      price_min_fcfa INTEGER,
      price_max_fcfa INTEGER,
      supplier_info TEXT,
      image_url TEXT,
      is_essential BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Vaccination schedule table
    `CREATE TABLE IF NOT EXISTS vaccination_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day INTEGER NOT NULL,
      vaccine_name TEXT NOT NULL,
      disease_target TEXT NOT NULL,
      administration_method TEXT,
      dosage TEXT,
      cost_fcfa INTEGER,
      notes_fr TEXT,
      notes_en TEXT,
      is_mandatory BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Quiz questions table
    `CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question_fr TEXT NOT NULL,
      question_en TEXT NOT NULL,
      options_fr TEXT NOT NULL, -- JSON array
      options_en TEXT NOT NULL, -- JSON array
      correct_answer INTEGER NOT NULL,
      explanation_fr TEXT,
      explanation_en TEXT,
      difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // User quiz results table
    `CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_taken INTEGER, -- in seconds
      passed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`,

    // Poultry lots table
    `CREATE TABLE IF NOT EXISTS poultry_lots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lot_name TEXT NOT NULL,
      poultry_type TEXT NOT NULL CHECK(poultry_type IN ('broilers', 'layers')),
      strain TEXT,
      start_date DATE NOT NULL,
      cycle_duration INTEGER NOT NULL,
      chicken_count INTEGER NOT NULL,
      target_weight REAL,
      status TEXT DEFAULT 'active' CHECK(status IN ('planned', 'active', 'completed', 'suspended')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`,

    // Resource analysis table
    `CREATE TABLE IF NOT EXISTS resource_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      has_land BOOLEAN NOT NULL,
      budget_fcfa INTEGER NOT NULL,
      desired_chickens INTEGER NOT NULL,
      experience_level TEXT NOT NULL CHECK(experience_level IN ('beginner', 'intermediate', 'expert')),
      poultry_type TEXT NOT NULL CHECK(poultry_type IN ('broilers', 'layers')),
      cycle_duration INTEGER NOT NULL,
      analysis_result TEXT, -- JSON object with recommendations
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`,

    // Daily progress tracking table
    `CREATE TABLE IF NOT EXISTS daily_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL,
      date DATE NOT NULL,
      tasks_assigned TEXT, -- JSON array of tasks
      tasks_completed TEXT, -- JSON array of completed task IDs
      weight_sample REAL,
      mortality_count INTEGER DEFAULT 0,
      feed_consumed REAL,
      water_consumed REAL,
      temperature REAL,
      humidity REAL,
      notes TEXT,
      completion_rate REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lot_id) REFERENCES poultry_lots (id) ON DELETE CASCADE,
      UNIQUE(lot_id, day_number)
    )`,

    // Monitoring devices table
    `CREATE TABLE IF NOT EXISTS monitoring_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      device_name TEXT NOT NULL,
      device_type TEXT NOT NULL,
      lot_id INTEGER,
      settings TEXT, -- JSON object with thresholds
      last_data TEXT, -- JSON object with latest sensor readings
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'maintenance')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (lot_id) REFERENCES poultry_lots (id) ON DELETE SET NULL
    )`,

    // Monitoring alerts table
    `CREATE TABLE IF NOT EXISTS monitoring_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER NOT NULL,
      alert_type TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
      is_read BOOLEAN DEFAULT FALSE,
      is_resolved BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY (device_id) REFERENCES monitoring_devices (id) ON DELETE CASCADE
    )`,

    // Forum categories table
    `CREATE TABLE IF NOT EXISTS forum_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_fr TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description_fr TEXT,
      description_en TEXT,
      color TEXT DEFAULT '#548C2F',
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Forum posts table
    `CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      images TEXT, -- JSON array of image URLs
      is_pinned BOOLEAN DEFAULT FALSE,
      is_locked BOOLEAN DEFAULT FALSE,
      view_count INTEGER DEFAULT 0,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES forum_categories (id) ON DELETE CASCADE
    )`,

    // Forum comments table
    `CREATE TABLE IF NOT EXISTS forum_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      parent_id INTEGER, -- for nested comments
      content TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES forum_posts (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES forum_comments (id) ON DELETE CASCADE
    )`,

    // Chatbot conversation history table
    `CREATE TABLE IF NOT EXISTS chatbot_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      context TEXT, -- 'poultry', 'general', etc.
      response_time INTEGER, -- in milliseconds
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`,

    // Subscription plans table
    `CREATE TABLE IF NOT EXISTS subscription_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_fcfa INTEGER NOT NULL,
      duration_days INTEGER NOT NULL,
      features TEXT, -- JSON array of features
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Payment history table
    `CREATE TABLE IF NOT EXISTS payment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      amount_fcfa INTEGER NOT NULL,
      payment_method TEXT,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
    )`,

    // Admin logs table
    `CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT, -- 'user', 'content', 'system'
      target_id INTEGER,
      details TEXT, -- JSON object with action details
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE
    )`
  ]

  // Create all tables
  for (const table of tables) {
    await new Promise((resolve, reject) => {
      db.run(table, (err) => {
        if (err) {
          console.error('Error creating table:', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // Create indexes for better performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription)',
    'CREATE INDEX IF NOT EXISTS idx_training_category ON training_content(category)',
    'CREATE INDEX IF NOT EXISTS idx_lots_user_id ON poultry_lots(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_lots_status ON poultry_lots(status)',
    'CREATE INDEX IF NOT EXISTS idx_daily_progress_lot_day ON daily_progress(lot_id, day_number)',
    'CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id)',
    'CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON forum_posts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id)',
    'CREATE INDEX IF NOT EXISTS idx_monitoring_devices_user ON monitoring_devices(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_chatbot_user ON chatbot_conversations(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_payment_user ON payment_history(user_id)'
  ]

  for (const index of indexes) {
    await new Promise((resolve, reject) => {
      db.run(index, (err) => {
        if (err) {
          console.error('Error creating index:', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  db.close()
  console.log('✅ Base de données initialisée avec succès')
}

export { DB_PATH }
