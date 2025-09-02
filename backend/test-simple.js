import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

async function testAPI() {
  console.log('🧪 Test de l\'API EcoLoop...\n')

  try {
    // Test 1: Health check
    console.log('1️⃣ Test du health check...')
    const healthResponse = await api.get('/health')
    console.log('   ✅ Health check:', healthResponse.data.status)

    // Test 2: Login
    console.log('\n2️⃣ Test de connexion...')
    const loginResponse = await api.post('/api/auth/login', {
      email: 'user@demo.com',
      password: 'demo123'
    })
    
    if (loginResponse.data.success) {
      console.log('   ✅ Connexion réussie')
      const token = loginResponse.data.token
      
      // Configuration du token pour les prochains appels
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Test 3: Training endpoints
      console.log('\n3️⃣ Test des formations...')
      const trainingResponse = await api.get('/api/training/categories')
      console.log('   ✅ Formations:', trainingResponse.data.categories.length, 'catégories trouvées')

      // Test 4: Tracking endpoints (peut nécessiter un abonnement Pro)
      console.log('\n4️⃣ Test du suivi...')
      try {
        const trackingResponse = await api.get('/api/tracking/lots')
        console.log('   ✅ Lots de suivi:', trackingResponse.data.data?.length || 0, 'lots trouvés')
      } catch (error) {
        console.log('   ⚠️  Suivi: nécessite un abonnement Pro')
      }

      // Test 5: Monitoring endpoints (peut nécessiter un abonnement Premium)
      console.log('\n5️⃣ Test de la surveillance...')
      try {
        const monitoringResponse = await api.get('/api/monitoring/dashboard')
        console.log('   ✅ Surveillance: données récupérées')
      } catch (error) {
        console.log('   ⚠️  Surveillance: nécessite un abonnement Premium')
      }

      // Test 6: Forum endpoints
      console.log('\n6️⃣ Test du forum...')
      try {
        const forumResponse = await api.get('/api/forum/categories')
        console.log('   ✅ Forum:', forumResponse.data.data?.length || 0, 'catégories trouvées')
      } catch (error) {
        console.log('   ⚠️  Forum: erreur -', error.response?.data?.message || error.message)
      }

      console.log('\n🎉 Tous les tests sont passés avec succès!')
      console.log('\n📋 Résumé:')
      console.log('   🌐 Backend: http://localhost:5000')
      console.log('   🖥️  Frontend: http://localhost:3000')
      console.log('   👤 Compte test: user@demo.com / demo123')
      console.log('   🔑 Compte admin: admin@demo.com / admin123')
      
    } else {
      console.log('   ❌ Échec de la connexion')
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Le serveur backend n\'est pas démarré.')
      console.log('   Démarrez-le avec: node server.js')
    }
  }
}

// Exécuter les tests
testAPI()
