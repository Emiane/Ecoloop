import React, { useState } from 'react'
import FormationPageCameroun from './FormationPageCameroun.jsx'
import TrackingPageCameroun from './TrackingPageCameroun.jsx'

function DashboardModern({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('FR')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Traductions
  const translations = {
    FR: {
      dashboard: 'Tableau de bord',
      formation: 'Formation',
      tracking: 'Suivi',
      monitoring: 'Surveillance',
      chatbot: 'Chatbot',
      forum: 'Forum',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      welcome: 'Bienvenue',
      profile: 'Profil',
      editProfile: 'Modifier le profil',
      darkMode: 'Mode sombre',
      language: 'Langue',
      coursesAvailable: 'Cours disponibles',
      poultryTracked: 'Volailles suivies',
      survivalRate: 'Taux de survie',
      monthlyRevenue: 'Revenus mensuel',
      managementTools: 'Vos outils de gestion',
      formationDesc: 'Accédez à nos cours complets sur l\'élevage avicole, validés par des experts ITAVI et INRAE.',
      trackingDesc: 'Suivez la croissance, la consommation et la santé de vos volailles en temps réel.',
      monitoringDesc: 'Surveillez température, humidité et qualité de l\'air dans vos poulaillers.',
      forumDesc: 'Échangez avec 10,000+ éleveurs et obtenez des conseils d\'experts.',
      chatbotDesc: 'Assistant IA pour répondre à vos questions sur l\'élevage avicole.',
      settingsDesc: 'Configurez vos préférences et gérez votre compte.'
    },
    EN: {
      dashboard: 'Dashboard',
      formation: 'Training',
      tracking: 'Tracking',
      monitoring: 'Monitoring',
      chatbot: 'Chatbot',
      forum: 'Forum',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome',
      profile: 'Profile',
      editProfile: 'Edit profile',
      darkMode: 'Dark mode',
      language: 'Language',
      coursesAvailable: 'Available courses',
      poultryTracked: 'Poultry tracked',
      survivalRate: 'Survival rate',
      monthlyRevenue: 'Monthly revenue',
      managementTools: 'Your management tools',
      formationDesc: 'Access our comprehensive poultry farming courses, validated by ITAVI and INRAE experts.',
      trackingDesc: 'Track growth, consumption and health of your poultry in real time.',
      monitoringDesc: 'Monitor temperature, humidity and air quality in your poultry houses.',
      forumDesc: 'Exchange with 10,000+ breeders and get expert advice.',
      chatbotDesc: 'AI assistant to answer your poultry farming questions.',
      settingsDesc: 'Configure your preferences and manage your account.'
    }
  }

  const t = translations[language]

  // Styles basés sur le mode
  const theme = {
    background: darkMode ? '#1a1a1a' : '#f8fffe',
    cardBg: darkMode ? '#2d2d2d' : '#fff',
    sidebarBg: darkMode ? '#262626' : '#fff',
    textPrimary: darkMode ? '#fff' : '#2d5a27',
    textSecondary: darkMode ? '#ccc' : '#5a6c57',
    border: darkMode ? '#404040' : '#e8f5e8',
    headerBg: darkMode ? '#262626' : '#fff'
  }

  if (currentPage === 'formation') {
    return (
      <FormationPageCameroun 
        user={user}
        onBack={() => setCurrentPage('dashboard')}
        darkMode={darkMode}
        language={language}
      />
    )
  }

  if (currentPage === 'tracking') {
    return (
      <TrackingPageCameroun 
        user={user}
        onBack={() => setCurrentPage('dashboard')}
        darkMode={darkMode}
        language={language}
      />
    )
  }

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: t.dashboard },
    { id: 'formation', icon: '📚', label: t.formation },
    { id: 'tracking', icon: '🐣', label: t.tracking },
    { id: 'monitoring', icon: '🌡️', label: t.monitoring },
    { id: 'chatbot', icon: '🤖', label: t.chatbot },
    { id: 'forum', icon: '🤝', label: t.forum },
    { id: 'settings', icon: '⚙️', label: t.settings }
  ]

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboardContent()
      case 'tracking':
        return renderTrackingContent()
      case 'monitoring':
        return renderMonitoringContent()
      case 'chatbot':
        return renderChatbotContent()
      case 'forum':
        return renderForumContent()
      case 'settings':
        return renderSettingsContent()
      default:
        return renderDashboardContent()
    }
  }

  const renderDashboardContent = () => (
    <div>
      {/* Hero Dashboard */}
      <section style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1f4220 0%, #2d5a27 100%)'
          : 'linear-gradient(135deg, #2d5a27 0%, #4a8c3a 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '15px',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          {t.welcome}, {user.firstName} ! 👋
        </h2>
        <p style={{
          fontSize: '18px',
          opacity: 0.9,
          marginBottom: '30px'
        }}>
          Gérez votre élevage avec efficacité et modernité
        </p>
        
        {/* Quick stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>6</div>
            <div style={{ opacity: 0.8 }}>{t.coursesAvailable}</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🐣</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2,450</div>
            <div style={{ opacity: 0.8 }}>{t.poultryTracked}</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>95%</div>
            <div style={{ opacity: 0.8 }}>{t.survivalRate}</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>45kFCFA</div>
            <div style={{ opacity: 0.8 }}>{t.monthlyRevenue}</div>
          </div>
        </div>
      </section>

      {/* Main features grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {sidebarItems.slice(1).map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: '15px',
              padding: '25px',
              boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onClick={() => setCurrentPage(item.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = darkMode ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {item.icon}
            </div>
            <h4 style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {item.label}
            </h4>
            <p style={{
              color: theme.textSecondary,
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              {getDescriptionForItem(item.id)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const getDescriptionForItem = (itemId) => {
    switch (itemId) {
      case 'formation': return t.formationDesc
      case 'tracking': return t.trackingDesc
      case 'monitoring': return t.monitoringDesc
      case 'chatbot': return t.chatbotDesc
      case 'forum': return t.forumDesc
      case 'settings': return t.settingsDesc
      default: return ''
    }
  }

  const renderTrackingContent = () => (
    <div style={{ color: theme.textPrimary }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>🐣 {t.tracking}</h2>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>
          Créez et gérez vos lots de poulets. Suivez leur croissance et leur santé.
        </p>
        <button style={{
          backgroundColor: '#ff6b35',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Créer un nouveau lot
        </button>
      </div>
    </div>
  )

  const renderMonitoringContent = () => (
    <div style={{ color: theme.textPrimary }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>🌡️ {t.monitoring}</h2>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>
          Surveillance en temps réel de vos poulaillers.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: theme.background, padding: '15px', borderRadius: '8px' }}>
            <div>Température: 22°C</div>
            <div>Humidité: 65%</div>
          </div>
          <div style={{ backgroundColor: theme.background, padding: '15px', borderRadius: '8px' }}>
            <div>CO2: 850 ppm</div>
            <div>NH3: 12 ppm</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderChatbotContent = () => (
    <div style={{ color: theme.textPrimary }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>🤖 {t.chatbot}</h2>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
        height: '500px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          backgroundColor: theme.background,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px',
          overflowY: 'auto'
        }}>
          <div style={{ color: theme.textSecondary }}>
            Bonjour ! Je suis votre assistant IA pour l'élevage avicole. Posez-moi vos questions !
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Tapez votre question..."
            style={{
              flex: 1,
              padding: '12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              backgroundColor: theme.background,
              color: theme.textPrimary
            }}
          />
          <button style={{
            backgroundColor: '#2d5a27',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )

  const renderForumContent = () => (
    <div style={{ color: theme.textPrimary }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>🤝 {t.forum}</h2>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>
          Discussions récentes de la communauté
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: theme.background, padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Problème de mortalité élevée</div>
            <div style={{ color: theme.textSecondary, fontSize: '14px' }}>Par Jean Dupont • Il y a 2h</div>
          </div>
          <div style={{ backgroundColor: theme.background, padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Conseils pour l'hiver</div>
            <div style={{ color: theme.textSecondary, fontSize: '14px' }}>Par Marie Martin • Il y a 5h</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsContent = () => (
    <div style={{ color: theme.textPrimary }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>⚙️ {t.settings}</h2>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '30px',
        borderRadius: '15px',
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Informations personnelles
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input
                type="text"
                defaultValue={user.firstName}
                style={{
                  padding: '10px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.background,
                  color: theme.textPrimary
                }}
              />
              <input
                type="text"
                defaultValue={user.lastName}
                style={{
                  padding: '10px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.background,
                  color: theme.textPrimary
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                backgroundColor: theme.background,
                color: theme.textPrimary
              }}
            />
          </div>
          <button style={{
            backgroundColor: '#2d5a27',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            width: 'fit-content'
          }}>
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      display: 'flex'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: theme.sidebarBg,
        boxShadow: darkMode ? '2px 0 10px rgba(0,0,0,0.3)' : '2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img 
            src="/logo.png" 
            alt="EcoLoop Logo" 
            style={{ height: '35px', width: 'auto' }}
          />
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.textPrimary
          }}>
            EcoLoop
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: 'none',
                backgroundColor: currentPage === item.id ? '#2d5a27' : 'transparent',
                color: currentPage === item.id ? 'white' : theme.textPrimary,
                textAlign: 'left',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.backgroundColor = darkMode ? '#404040' : '#f0f9ff'
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <div style={{ padding: '20px', borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px 20px',
              border: `2px solid #dc2626`,
              backgroundColor: 'transparent',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#dc2626'
              e.target.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#dc2626'
            }}
          >
            🚪 {t.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ 
        marginLeft: '250px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: theme.headerBg,
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <h2 style={{
            margin: 0,
            color: theme.textPrimary,
            fontSize: '24px'
          }}>
            {sidebarItems.find(item => item.id === currentPage)?.label || t.dashboard}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🌐 {language}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Notifications */}
            <button
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
                position: 'relative'
              }}
              title="Bonnes pratiques et alertes"
            >
              🔔
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#ff6b35',
                color: 'white',
                borderRadius: '50%',
                width: '8px',
                height: '8px',
                fontSize: '8px'
              }}></span>
            </button>

            {/* Profile menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  border: 'none',
                  color: theme.textPrimary,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                👤
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  backgroundColor: theme.cardBg,
                  boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                  minWidth: '200px',
                  border: `1px solid ${theme.border}`,
                  zIndex: 1000
                }}>
                  <div style={{ marginBottom: '10px', color: theme.textPrimary }}>
                    <div style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: '14px', color: theme.textSecondary }}>{user.email}</div>
                  </div>
                  <hr style={{ border: `1px solid ${theme.border}`, margin: '10px 0' }} />
                  <button
                    onClick={() => {
                      setCurrentPage('settings')
                      setShowProfileMenu(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.textPrimary,
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = darkMode ? '#404040' : '#f0f9ff'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    ⚙️ {t.editProfile}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ 
          flex: 1, 
          padding: '30px',
          overflow: 'auto'
        }}>
          {renderPageContent()}
        </div>
      </main>
    </div>
  )
}

export default DashboardModern
