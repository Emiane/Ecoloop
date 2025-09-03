import React from 'react'

function LandingPageModern({ onLogin, onSignup }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fffe' }}>
      {/* Header Navigation */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Arial, sans-serif'
            }}>
              EcoLoop
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={onLogin}
              style={{
                backgroundColor: 'transparent',
                color: '#2d5a27',
                border: '2px solid #2d5a27',
                padding: '10px 25px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2d5a27'
                e.target.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#2d5a27'
              }}
            >
              Se connecter
            </button>
            <button
              onClick={onSignup}
              style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e55a2b'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ff6b35'
              }}
            >
              S'inscrire
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%)',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '50px' }}>
            {/* Left Content */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#2d5a27',
                marginBottom: '20px',
                lineHeight: '1.2'
              }}>
                Révolutionnez votre 
                <span style={{ color: '#ff6b35' }}> élevage avicole</span>
              </h1>
              
              <p style={{
                fontSize: '20px',
                color: '#5a6c57',
                marginBottom: '30px',
                lineHeight: '1.6'
              }}>
                Optimisez vos performances avec notre plateforme intelligente de suivi, 
                formation et gestion d'élevage de volailles.
              </p>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                <button
                  onClick={onSignup}
                  style={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    padding: '15px 35px',
                    borderRadius: '30px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Commencer gratuitement
                </button>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#2d5a27',
                    border: '2px solid #2d5a27',
                    padding: '15px 35px',
                    borderRadius: '30px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Voir la démo
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27' }}>10,000+</div>
                  <div style={{ color: '#5a6c57' }}>Éleveurs satisfaits</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27' }}>250+</div>
                  <div style={{ color: '#5a6c57' }}>Cours disponibles</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27' }}>95%</div>
                  <div style={{ color: '#5a6c57' }}>Taux de succès</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div style={{ flex: 1 }}>
              <img 
                src="/land.jpg" 
                alt="Élevage moderne" 
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#2d5a27',
            marginBottom: '50px'
          }}>
            Tout ce dont vous avez besoin pour réussir
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: '#f8fffe',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid #e8f5e8'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>📚</div>
              <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>Formation Expert</h3>
              <p style={{ color: '#5a6c57', lineHeight: '1.6' }}>
                Accédez à plus de 250 cours créés par des experts de l'élevage avicole. 
                Apprenez les meilleures pratiques du secteur.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: '#f8fffe',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid #e8f5e8'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>📊</div>
              <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>Suivi Intelligent</h3>
              <p style={{ color: '#5a6c57', lineHeight: '1.6' }}>
                Surveillez en temps réel la santé, la croissance et la productivité 
                de vos volailles avec nos outils de monitoring.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: '#f8fffe',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid #e8f5e8'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>🤝</div>
              <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>Communauté Active</h3>
              <p style={{ color: '#5a6c57', lineHeight: '1.6' }}>
                Rejoignez une communauté de 10,000+ éleveurs. Partagez vos expériences 
                et obtenez des conseils d'experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#2d5a27',
            marginBottom: '50px'
          }}>
            Choisissez votre plan
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* Free Plan */}
            <div style={{
              backgroundColor: '#fff',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '2px solid #e8f5e8'
            }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '10px', fontSize: '24px' }}>Gratuit</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d5a27', marginBottom: '20px' }}>
                0FCFA<span style={{ fontSize: '16px', color: '#5a6c57' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Accès aux cours de base</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Accès au Chatbot</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Forum communautaire</li>
              </ul>
              <button
                onClick={onSignup}
                style={{
                  backgroundColor: '#2d5a27',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Commencer
              </button>
            </div>

            {/* Pro Plan */}
            <div style={{
              backgroundColor: '#fff',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '3px solid #ff6b35',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ff6b35',
                color: 'white',
                padding: '5px 20px',
                borderRadius: '15px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                POPULAIRE
              </div>
              <h3 style={{ color: '#2d5a27', marginBottom: '10px', fontSize: '24px' }}>Pro</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d5a27', marginBottom: '20px' }}>
                5000FCFA<span style={{ fontSize: '16px', color: '#5a6c57' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Tous les cours disponibles</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Suivi illimité</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Rapports avancés</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Support prioritaire</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Statistique</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Systeme de notification</li>
              </ul>
              <button
                onClick={onSignup}
                style={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Choisir Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              backgroundColor: '#fff',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '2px solid #e8f5e8'
            }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '10px', fontSize: '24px' }}>Premium</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d5a27', marginBottom: '20px' }}>
                15000FCFA<span style={{ fontSize: '16px', color: '#5a6c57' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Tout du plan Pro</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ API personnalisée</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Formation sur site</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Support dédié 24/7</li>
                <li style={{ marginBottom: '10px', color: '#5a6c57' }}>✓ Surveillance temps reel</li>
              </ul>
              <button
                style={{
                  backgroundColor: '#2d5a27',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d5a27',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <img 
              src="/logo.png" 
              alt="EcoLoop Logo" 
              style={{ height: '30px', width: 'auto' }}
            />
            <h3 style={{ margin: 0, fontSize: '24px' }}>EcoLoop</h3>
          </div>
          <p style={{ marginBottom: '20px', color: '#a8c5a3' }}>
            Votre partenaire de confiance pour un élevage avicole moderne et durable
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{ color: '#a8c5a3', textDecoration: 'none' }}>À propos</a>
            <a href="#" style={{ color: '#a8c5a3', textDecoration: 'none' }}>Contact</a>
            <a href="#" style={{ color: '#a8c5a3', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: '#a8c5a3', textDecoration: 'none' }}>CGU</a>
            <a href="#" style={{ color: '#a8c5a3', textDecoration: 'none' }}>Confidentialité</a>
          </div>
          <p style={{ margin: 0, color: '#a8c5a3', fontSize: '14px' }}>
            © 2025 EcoLoop. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageModern
