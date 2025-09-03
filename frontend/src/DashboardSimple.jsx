import React, { useState } from 'react'
import FormationPage from './FormationPage.jsx'

function DashboardSimple({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onLogout()
  }

  // Si on n'est pas sur le dashboard, afficher la page correspondante
  if (currentPage === 'formation') {
    return <FormationPage user={user} onBack={() => setCurrentPage('dashboard')} />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#548C2F',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🌱 Ecoloop Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Bonjour, {user.first_name} !</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome section */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#548C2F', marginBottom: '15px' }}>
            Bienvenue sur votre tableau de bord !
          </h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Gérez votre ferme avicole avec les outils intelligents d'Ecoloop.
          </p>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Informations du compte :</h3>
            <p><strong>Nom :</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Ville :</strong> {user.city}</p>
            <p><strong>Rôle :</strong> {user.role}</p>
            <p><strong>Abonnement :</strong> {user.subscription}</p>
            <p><strong>Langue :</strong> {user.language}</p>
          </div>
        </div>

        {/* Features grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Formation */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📚</div>
            <h3 style={{ color: '#548C2F' }}>Formation</h3>
            <p style={{ color: '#666' }}>
              Accédez aux cours et guides d'élevage avicole
            </p>
            <button 
              onClick={() => setCurrentPage('formation')}
              style={{
                backgroundColor: '#548C2F',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Voir les cours
            </button>
          </div>

          {/* Suivi */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <h3 style={{ color: '#548C2F' }}>Suivi</h3>
            <p style={{ color: '#666' }}>
              Gérez vos lots et suivez leurs performances
            </p>
            <button style={{
              backgroundColor: '#548C2F',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Mes lots
            </button>
          </div>

          {/* Monitoring */}
          {user.subscription === 'premium' && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚡</div>
              <h3 style={{ color: '#548C2F' }}>Monitoring</h3>
              <p style={{ color: '#666' }}>
                Surveillance en temps réel
              </p>
              <button style={{
                backgroundColor: '#548C2F',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Dashboard
              </button>
            </div>
          )}

          {/* Forum */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
            <h3 style={{ color: '#548C2F' }}>Forum</h3>
            <p style={{ color: '#666' }}>
              Échangez avec la communauté
            </p>
            <button style={{
              backgroundColor: '#548C2F',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Discussions
            </button>
          </div>
        </div>

        {/* Status */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#548C2F' }}>État du système</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div>✅ Backend connecté</div>
            <div>✅ Base de données active</div>
            <div>✅ Authentification OK</div>
            <div>✅ Abonnement {user.subscription}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardSimple
