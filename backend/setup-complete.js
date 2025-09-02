import { initializeDatabase } from './database/init.js'
import { seedDatabase } from './database/seed.js'

async function setupComplete() {
  try {
    console.log('🚀 Initialisation complète d\'EcoLoop...')
    
    // Initialiser la base de données
    console.log('📁 Création des tables...')
    await initializeDatabase()
    
    // Ajouter les données de démonstration
    console.log('🌱 Ajout des données de démonstration...')
    await seedDatabase()
    
    console.log('✅ Configuration terminée avec succès !')
    console.log('')
    console.log('🎯 Comptes de test créés :')
    console.log('   👤 Utilisateur: user@demo.com / demo123')
    console.log('   🔑 Admin: admin@demo.com / admin123')
    console.log('')
    console.log('🌐 L\'application est prête à être utilisée !')
    console.log('   Backend: http://localhost:5000')
    console.log('   Frontend: http://localhost:3000')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
    process.exit(1)
  }
}

// Lancer la configuration si ce script est exécuté directement
if (process.argv[1].endsWith('setup-complete.js')) {
  setupComplete()
}

export { setupComplete }
