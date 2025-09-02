import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

// Configuration d'axios
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
        password: 'demo123'
      })
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Erreur login: ${loginResponse.status}`)
    }
    
    const loginData = await loginResponse.json()
    const token = loginData.data.token
    console.log('   ✅ Connexion réussie')

    // Test 3: Récupération du profil
    console.log('\n3️⃣ Test récupération profil...')
    const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const profileData = await profileResponse.json()
    console.log('   ✅ Profil récupéré:', profileData.data.email)

    // Test 4: Contenu de formation
    console.log('\n4️⃣ Test contenu de formation...')
    const trainingResponse = await fetch(`${BASE_URL}/api/training/categories?lang=fr`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const trainingData = await trainingResponse.json()
    console.log('   ✅ Catégories de formation:', trainingData.data.length)

    // Test 5: Plans d'abonnement
    console.log('\n5️⃣ Test plans d\'abonnement...')
    const plansResponse = await fetch(`${BASE_URL}/api/subscription/plans?lang=fr`)
    const plansData = await plansResponse.json()
    console.log('   ✅ Plans disponibles:', plansData.data.length)

    // Test 6: Forum
    console.log('\n6️⃣ Test forum...')
    const forumResponse = await fetch(`${BASE_URL}/api/forum/categories?lang=fr`)
    const forumData = await forumResponse.json()
    console.log('   ✅ Catégories forum:', forumData.data.length)

    // Test 7: Chatbot
    console.log('\n7️⃣ Test chatbot...')
    const chatbotResponse = await fetch(`${BASE_URL}/api/chatbot/quick-responses?lang=fr`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const chatbotData = await chatbotResponse.json()
    console.log('   ✅ Réponses rapides chatbot:', chatbotData.data.length)

    console.log('\n🎉 Tous les tests sont passés avec succès !')
    console.log('\n📋 Résumé des fonctionnalités testées:')
    console.log('   • Authentification (login/profil)')
    console.log('   • Formation (catégories et contenu)')
    console.log('   • Abonnements (plans)')
    console.log('   • Forum (catégories)')
    console.log('   • Chatbot (réponses rapides)')

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message)
    console.log('\n💡 Assurez-vous que le serveur backend est démarré sur le port 5000')
    process.exit(1)
  }
}

// Test de connexion avec timeout
async function testConnection() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${BASE_URL}/health`, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('🔍 Vérification de la connexion au serveur...')
  
  const isConnected = await testConnection()
  
  if (!isConnected) {
    console.log('❌ Impossible de se connecter au serveur')
    console.log('💡 Démarrez le serveur avec: npm run dev')
    process.exit(1)
  }
  
  console.log('✅ Serveur accessible\n')
  await testAPI()
}

// Ajouter node-fetch si pas installé
if (typeof fetch === 'undefined') {
  console.log('📦 Installation de node-fetch...')
  const { execSync } = await import('child_process')
  try {
    execSync('npm install node-fetch', { stdio: 'inherit' })
    console.log('✅ node-fetch installé')
  } catch (error) {
    console.error('❌ Erreur installation node-fetch:', error.message)
    process.exit(1)
  }
}

main()
