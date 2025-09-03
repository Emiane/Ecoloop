import React, { useState } from 'react'

function SignupPageModern({ onSignupSuccess, onBackToLanding, onGoToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    location: '',
    subscription: 'free'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          farmName: formData.farmName,
          location: formData.location,
          subscription: formData.subscription
        })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onSignupSuccess(data.user)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Signup error:', error)
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
            onClick={onGoToLogin}
            style={{
              backgroundColor: 'transparent',
              color: '#2d5a27',
              border: '2px solid #2d5a27',
              padding: '10px 25px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#2d5a27',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            Rejoignez EcoLoop
          </h2>
          <p style={{
            color: '#5a6c57',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '18px'
          }}>
            Créez votre compte pour commencer votre parcours d'éleveur moderne
          </p>

          {error && (
            <div style={{
              backgroundColor: '#ffeaa7',
              color: '#e17055',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d5a27',
                  fontWeight: '600'
                }}>
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e8f5e8',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                  onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d5a27',
                  fontWeight: '600'
                }}>
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e8f5e8',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                  onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d5a27',
                  fontWeight: '600'
                }}>
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e8f5e8',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                  onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2d5a27',
                  fontWeight: '600'
                }}>
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e8f5e8',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                  onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Nom de votre exploitation
              </label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleInputChange}
                placeholder="Ex: Ferme du Moulin Vert"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Localisation
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ex: Bretagne, France"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2d5a27'}
                onBlur={(e) => e.target.style.borderColor = '#e8f5e8'}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d5a27',
                fontWeight: '600'
              }}>
                Plan d'abonnement
              </label>
              <select
                name="subscription"
                value={formData.subscription}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e8f5e8',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#fff'
                }}
              >
                <option value="free">Gratuit - 0€/mois</option>
                <option value="pro">Pro - 29€/mois</option>
                <option value="enterprise">Entreprise - 99€/mois</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#ccc' : '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#5a6c57'
          }}>
            Déjà un compte ? {' '}
            <button
              onClick={onGoToLogin}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#2d5a27',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px'
              }}
            >
              Se connecter
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

export default SignupPageModern
