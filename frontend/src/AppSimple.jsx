import React, { useState, useEffect } from 'react'

function AppSimple() {
  const [backendStatus, setBackendStatus] = useState('Test en cours...')
  const [apiData, setApiData] = useState(null)
  const [loginResult, setLoginResult] = useState(null)

  const testBackend = async () => {
    try {
      console.log('Testing backend connection...')
      
      const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      setBackendStatus('✅ Backend connecté !')
      setApiData(data)
    } catch (error) {
      console.error('Fetch error:', error)
      setBackendStatus('❌ Erreur: ' + error.message)
      setApiData({ error: error.message, stack: error.stack })
    }
  }

  // Test de connexion avec l'utilisateur de test
  const testLogin = async () => {
    try {
      setLoginResult('Test de connexion en cours...')
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@ecoloop.com',
          password: 'password123'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setLoginResult('✅ Connexion réussie ! Token: ' + data.token?.substring(0, 50) + '...')
      } else {
        setLoginResult('❌ Erreur de connexion: ' + data.message)
      }
      
    } catch (error) {
      setLoginResult('❌ Erreur: ' + error.message)
    }
  }

  const testHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        mode: 'cors'
      })
      const data = await response.json()
      setBackendStatus('✅ Health check OK!')
      setApiData(data)
    } catch (error) {
      setBackendStatus('❌ Health check failed: ' + error.message)
    }
  }

  useEffect(() => {
    testBackend()
  }, [])

  return (
    <div className="container">
      <h1>🌱 Ecoloop - Test Frontend</h1>
      <p>L'application frontend fonctionne !</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          className="btn btn-primary" 
          onClick={testBackend}
          style={{ marginRight: '10px' }}
        >
          Test Root API
        </button>
        <button 
          className="btn btn-primary" 
          onClick={testHealth}
          style={{ marginRight: '10px' }}
        >
          Test Health
        </button>
        <button 
          className="btn btn-primary" 
          onClick={testLogin}
        >
          Test Login
        </button>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h3>État des services :</h3>
        <p>✅ Frontend : Actif (port 3002)</p>
        <p>{backendStatus}</p>
        <p>📊 Base de données : SQLite</p>
        {loginResult && <p>🔐 Authentification : {loginResult}</p>}
      </div>

      {apiData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
          <h3>Réponse de l'API :</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fffacd', borderRadius: '5px' }}>
        <h3>🧪 Tests disponibles :</h3>
        <p><strong>Utilisateur de test :</strong></p>
        <p>📧 Email: test@ecoloop.com</p>
        <p>🔑 Mot de passe: password123</p>
        <p>💎 Abonnement: premium</p>
        <br/>
        <p><strong>Utilisateur admin :</strong></p>
        <p>📧 Email: admin@ecoloop.com</p>
        <p>🔑 Mot de passe: admin123</p>
        <p>👨‍💼 Rôle: admin</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
        <h3>Debug Info :</h3>
        <p>Frontend URL: {window.location.href}</p>
        <p>Backend URL: http://localhost:5000</p>
        <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
      </div>
    </div>
  )
}

export default AppSimple
