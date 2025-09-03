import { getDatabase } from './database/init.js'
import bcrypt from 'bcryptjs'

async function createTestUser() {
  try {
    const db = await getDatabase()
    
    // Données de l'utilisateur de test
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@ecoloop.com',
      password: 'password123',
      city: 'Paris',
      role: 'user',
      subscription: 'premium',
      language: 'fr',
      theme: 'light'
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM users WHERE email = ?',
        [testUser.email],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })
    
    if (existingUser) {
      console.log('✅ L\'utilisateur de test existe déjà:', testUser.email)
      db.close()
      return
    }
    
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(testUser.password, 12)
    
    // Insérer l'utilisateur
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (
          first_name, last_name, email, password_hash, city, 
          role, subscription, language, theme, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, [
        testUser.firstName,
        testUser.lastName, 
        testUser.email,
        hashedPassword,
        testUser.city,
        testUser.role,
        testUser.subscription,
        testUser.language,
        testUser.theme
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
    
    console.log('🎉 Utilisateur de test créé avec succès !')
    console.log('📧 Email:', testUser.email)
    console.log('🔑 Mot de passe:', testUser.password)
    console.log('👤 Rôle:', testUser.role)
    console.log('💎 Abonnement:', testUser.subscription)
    
    db.close()
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur de test:', error)
  }
}

// Créer aussi un utilisateur admin
async function createAdminUser() {
  try {
    const db = await getDatabase()
    
    const adminUser = {
      firstName: 'Admin',
      lastName: 'Ecoloop',
      email: 'admin@ecoloop.com',
      password: 'admin123',
      city: 'Paris',
      role: 'admin',
      subscription: 'premium',
      language: 'fr',
      theme: 'light'
    }
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM users WHERE email = ?',
        [adminUser.email],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })
    
    if (existingAdmin) {
      console.log('✅ L\'utilisateur admin existe déjà:', adminUser.email)
      db.close()
      return
    }
    
    const hashedPassword = await bcrypt.hash(adminUser.password, 12)
    
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (
          first_name, last_name, email, password_hash, city, 
          role, subscription, language, theme, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, [
        adminUser.firstName,
        adminUser.lastName, 
        adminUser.email,
        hashedPassword,
        adminUser.city,
        adminUser.role,
        adminUser.subscription,
        adminUser.language,
        adminUser.theme
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
    
    console.log('🎉 Utilisateur admin créé avec succès !')
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Mot de passe:', adminUser.password)
    console.log('👤 Rôle:', adminUser.role)
    
    db.close()
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error)
  }
}

// Exécuter la création des utilisateurs
async function main() {
  console.log('🚀 Création des utilisateurs de test...\n')
  await createTestUser()
  console.log('')
  await createAdminUser()
  console.log('\n✅ Terminé !')
}

main()
