import React, { useState } from 'react'

function LoginPageSimple({ onLogin, onBackToLanding, onGoToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erreur de connexion')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fffe' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '15px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div 
            onClick={onBackToLanding}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <img 
              src="/logo.png" 
              alt="EcoLoop Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #2d5a27, #4a8c3a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              EcoLoop
            </h1>
          </div>
          
          <button
            onClick={onGoToSignup}
            style={{
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            S'inscrire
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: '80px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%',
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{
              color: '#2d5a27',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Bon retour !
            </h2>
            <p style={{
              color: '#5a6c57',
              fontSize: '18px'
            }}>
              Connectez-vous à votre compte EcoLoop
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre.email@exemple.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2d5a27'
                  e.target.style.boxShadow = '0 0 0 3px rgba(45, 90, 39, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8f5e8'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2d5a27'
                  e.target.style.boxShadow = '0 0 0 3px rgba(45, 90, 39, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8f5e8'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#94a3b8' : '#2d5a27',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(45, 90, 39, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#1f4220'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#2d5a27'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span>Connexion...</span>
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#2d5a27',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px'
              }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            paddingTop: '25px',
            borderTop: '1px solid #e8f5e8'
          }}>
            <p style={{ color: '#5a6c57', marginBottom: '15px' }}>
              Pas encore de compte ?
            </p>
            <button
              onClick={onGoToSignup}
              style={{
                backgroundColor: 'transparent',
                color: '#ff6b35',
                border: '2px solid #ff6b35',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ff6b35'
                e.target.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#ff6b35'
              }}
            >
              Créer un compte gratuit
            </button>
          </div>

          {/* Quick login for testing */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8fffe',
            borderRadius: '10px',
            border: '1px solid #e8f5e8'
          }}>
            <h4 style={{ color: '#2d5a27', marginBottom: '15px', fontSize: '16px' }}>
              🚀 Connexion rapide (test)
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setEmail('test@ecoloop.com')
                  setPassword('test123')
                }}
                style={{
                  backgroundColor: '#e8f5e8',
                  color: '#2d5a27',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Utilisateur test
              </button>
              <button
                onClick={() => {
                  setEmail('admin@ecoloop.com')
                  setPassword('admin123')
                }}
                style={{
                  backgroundColor: '#e8f5e8',
                  color: '#2d5a27',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPageSimple
