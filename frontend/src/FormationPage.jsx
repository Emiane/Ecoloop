import React, { useState, useEffect } from 'react'

function FormationPage({ user, onBack }) {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseStarted, setCourseStarted] = useState(false)
  const [courseProgress, setCourseProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/training/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      } else {
        // Données de démonstration avec ratings
        setCourses([
          {
            id: 1,
            title: 'Démarrage d\'un élevage de poulets de chair',
            category: 'Débutant',
            summary: 'Guide complet pour créer votre élevage selon les normes ITAVI',
            duration: '3 heures',
            isPremium: false,
            rating: 4.6,
            totalRatings: 243,
            sections: [
              'Étude de faisabilité et business plan',
              'Réglementation et autorisations (ICPE)',
              'Conception et aménagement du bâtiment',
              'Équipements et matériel technique',
              'Choix des souches et partenaires commerciaux',
              'Calendrier de démarrage'
            ],
            content: {
              introduction: 'Ce cours s\'appuie sur les recommandations de l\'ITAVI (Institut Technique de l\'Aviculture) et du ministère de l\'Agriculture pour vous accompagner dans la création d\'un élevage de poulets de chair performant et conforme.',
              objectives: [
                'Maîtriser les étapes clés du projet d\'installation',
                'Comprendre la réglementation française (ICPE, bien-être animal)',
                'Dimensionner correctement les bâtiments et équipements',
                'Établir un budget prévisionnel réaliste'
              ]
            }
          },
          {
            id: 2,
            title: 'Nutrition et alimentation selon l\'INRAE',
            category: 'Intermédiaire',
            summary: 'Optimisez l\'alimentation selon les dernières recherches INRAE',
            duration: '4 heures',
            isPremium: true,
            rating: 4.8,
            totalRatings: 156,
            sections: [
              'Besoins nutritionnels par phase (INRAE 2018)',
              'Matières premières et additifs autorisés',
              'Formulation des aliments starter, croissance, finition',
              'Programmes alimentaires selon la souche',
              'Alternatives aux antibiotiques promoteurs de croissance',
              'Contrôle qualité et analyses'
            ],
            content: {
              introduction: 'Basé sur les tables INRAE 2018 et les recommandations du GIS Avicole, ce cours vous forme aux techniques modernes de nutrition avicole.',
              objectives: [
                'Calculer les besoins selon les phases de croissance',
                'Formuler des aliments équilibrés et économiques',
                'Intégrer les concepts de nutrition de précision',
                'Réduire l\'impact environnemental par l\'alimentation'
              ]
            }
          },
          {
            id: 3,
            title: 'Biosécurité et prévention sanitaire',
            category: 'Avancé',
            summary: 'Protection sanitaire selon les protocoles ANSES/DGAL',
            duration: '5 heures',
            isPremium: true,
            rating: 4.9,
            totalRatings: 198,
            sections: [
              'Plan de biosécurité réglementaire',
              'Prévention Influenza Aviaire et Newcastle',
              'Protocoles de nettoyage-désinfection',
              'Surveillance et diagnostic précoce',
              'Gestion des cadavres et déchets',
              'Traçabilité et registres obligatoires'
            ],
            content: {
              introduction: 'Formez-vous aux exigences de biosécurité selon la réglementation française (arrêtés DGAL) et les recommandations de l\'ANSES.',
              objectives: [
                'Mettre en place un plan de biosécurité efficace',
                'Prévenir les maladies réglementées (IA, Newcastle)',
                'Respecter les obligations de surveillance',
                'Optimiser les protocoles de nettoyage-désinfection'
              ]
            }
          },
          {
            id: 4,
            title: 'Bien-être animal et réglementation',
            category: 'Intermédiaire',
            summary: 'Conformité aux normes européennes de bien-être',
            duration: '3 heures',
            isPremium: false,
            rating: 4.5,
            totalRatings: 134,
            sections: [
              'Réglementation européenne et française',
              'Densité d\'élevage et espace vital',
              'Ambiance : température, ventilation, éclairage',
              'Enrichissement du milieu',
              'Indicateurs de bien-être (EBENE)',
              'Contrôles et sanctions'
            ],
            content: {
              introduction: 'Respectez la directive 2007/43/CE et l\'arrêté français du 28 juin 2010 fixant les normes minimales de protection des poulets de chair.',
              objectives: [
                'Comprendre les obligations légales',
                'Optimiser les conditions d\'ambiance',
                'Utiliser les indicateurs EBENE',
                'Préparer les contrôles officiels'
              ]
            }
          },
          {
            id: 5,
            title: 'Gestion technique et économique',
            category: 'Avancé',
            summary: 'Pilotage de la performance selon RMT Élevages et Environnement',
            duration: '4 heures',
            isPremium: true,
            rating: 4.7,
            totalRatings: 112,
            sections: [
              'Indicateurs techniques clés (IC, GMQ, TM)',
              'Analyse économique et coût de production',
              'Gestion des lots et planning',
              'Optimisation énergétique',
              'Impact environnemental et empreinte carbone',
              'Certification et signes de qualité'
            ],
            content: {
              introduction: 'Optimisez vos performances avec les méthodes développées par le RMT Élevages et Environnement et les références FranceAgriMer.',
              objectives: [
                'Maîtriser les indicateurs de performance',
                'Analyser la rentabilité de l\'élevage',
                'Réduire l\'impact environnemental',
                'Accéder aux marchés à valeur ajoutée'
              ]
            }
          },
          {
            id: 6,
            title: 'Commercialisation et filière',
            category: 'Intermédiaire',
            summary: 'Comprendre la filière française avec FranceAgriMer',
            duration: '2 heures',
            isPremium: false,
            rating: 4.3,
            totalRatings: 89,
            sections: [
              'Organisation de la filière avicole française',
              'Types de contrats et partenariats',
              'Qualité et classification des carcasses',
              'Marchés de niche et différenciation',
              'Exportation et marchés internationaux',
              'Tendances de consommation'
            ],
            content: {
              introduction: 'Découvrez les opportunités commerciales avec les données de FranceAgriMer et du CNPO (Comité National pour la Promotion de l\'Œuf).',
              objectives: [
                'Choisir le meilleur débouché commercial',
                'Négocier les contrats d\'élevage',
                'Comprendre la formation des prix',
                'Explorer les marchés de niche'
              ]
            }
          }
        ])
      }
    } catch (error) {
      console.error('Erreur chargement cours:', error)
    } finally {
      setLoading(false)
    }
  }

  const canAccessCourse = (course) => {
    if (!course.isPremium) return true
    return user.subscription === 'pro' || user.subscription === 'premium'
  }

  const handleCourseClick = (course) => {
    if (canAccessCourse(course)) {
      setSelectedCourse(course)
      setCourseStarted(false)
      setCourseProgress(0)
      setCurrentSection(0)
    }
  }

  const startCourse = () => {
    setCourseStarted(true)
    setCourseProgress(20) // 20% pour la première section
  }

  const nextSection = () => {
    const newSection = currentSection + 1
    const newProgress = Math.min(((newSection + 1) / selectedCourse.sections.length) * 100, 100)
    
    setCurrentSection(newSection)
    setCourseProgress(newProgress)
    
    // Si c'est la dernière section, proposer l'évaluation
    if (newSection >= selectedCourse.sections.length - 1) {
      setShowRatingForm(true)
    }
  }

  const submitRating = () => {
    // Ici on pourrait envoyer la note à l'API
    console.log('Rating submitted:', { rating: userRating, comment: userComment })
    alert(`Merci pour votre évaluation ! Note: ${userRating}/5`)
    setShowRatingForm(false)
    setSelectedCourse(null)
    setCourseStarted(false)
  }

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            style={{
              color: star <= rating ? '#FFD449' : '#ddd',
              fontSize: interactive ? '24px' : '16px',
              cursor: interactive ? 'pointer' : 'default'
            }}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  // Vue du cours en cours
  if (courseStarted && selectedCourse) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header avec progression */}
        <header style={{
          backgroundColor: '#2d5a27',
          color: 'white',
          padding: '15px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '20px' }}>📚 {selectedCourse.title}</h1>
            <button
              onClick={() => setCourseStarted(false)}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Retour
            </button>
          </div>
          
          {/* Barre de progression */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '8px' }}>
            <div 
              style={{
                backgroundColor: '#ff6b35',
                height: '100%',
                borderRadius: '10px',
                width: `${courseProgress}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            Progression: {Math.round(courseProgress)}% - Section {currentSection + 1}/{selectedCourse.sections.length}
          </p>
        </header>

        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#548C2F', marginBottom: '20px' }}>
              {selectedCourse.sections[currentSection]}
            </h2>

            <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>
                {selectedCourse.sections[currentSection]}
              </h3>
              
              {selectedCourse.content && (
                <div style={{
                  backgroundColor: '#f8fffe',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>📋 Introduction</h4>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>
                    {selectedCourse.content.introduction}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>🎯 Dans cette section :</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                  <li>Concepts fondamentaux de "{selectedCourse.sections[currentSection]}"</li>
                  <li>Réglementation et normes officielles applicables</li>
                  <li>Bonnes pratiques professionnelles recommandées</li>
                  <li>Exemples concrets et retours d'expérience</li>
                  <li>Points de vigilance et erreurs à éviter</li>
                </ul>
              </div>

              <div style={{ 
                backgroundColor: '#e8f5e8', 
                padding: '20px', 
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid #c5e3c5'
              }}>
                <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>💡 Point réglementaire</h4>
                <p style={{ margin: 0 }}>
                  Cette section couvre les aspects réglementaires essentiels liés à {selectedCourse.sections[currentSection].toLowerCase()}.
                  Les informations sont basées sur la réglementation française et européenne en vigueur.
                </p>
              </div>

              {/* Contenu détaillé basé sur les organismes officiels */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#2d5a27', marginBottom: '15px' }}>� Contenu de formation</h4>
                <div style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ color: '#2d5a27', marginBottom: '8px' }}>Documentation officielle :</h5>
                    <ul style={{ marginLeft: '20px', color: '#666' }}>
                      <li>Références ITAVI (Institut Technique de l'Aviculture)</li>
                      <li>Guides INRAE (Institut National de Recherche pour l'Agriculture)</li>
                      <li>Fiches techniques ANSES (Agence Nationale de Sécurité Sanitaire)</li>
                      <li>Réglementation DGAL (Direction Générale de l'Alimentation)</li>
                    </ul>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ color: '#2d5a27', marginBottom: '8px' }}>Cas pratiques :</h5>
                    <p style={{ margin: 0, color: '#666' }}>
                      Études de cas réels basés sur des élevages français, avec analyse 
                      des performances techniques et économiques selon les référentiels sectoriels.
                    </p>
                  </div>
                </div>
              </div>

              {currentSection < selectedCourse.sections.length - 1 && (
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#e65100' }}>
                    <strong>Prochaine section :</strong> {selectedCourse.sections[currentSection + 1]}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              {currentSection < selectedCourse.sections.length - 1 ? (
                <button
                  onClick={nextSection}
                  style={{
                    backgroundColor: '#548C2F',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Section suivante →
                </button>
              ) : (
                <button
                  onClick={nextSection}
                  style={{
                    backgroundColor: '#F9A620',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Terminer le cours 🎉
                </button>
              )}
            </div>
          </div>

          {/* Formulaire d'évaluation */}
          {showRatingForm && (
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}>
              <h3 style={{ color: '#548C2F', marginBottom: '20px' }}>
                🌟 Évaluez ce cours
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px' }}>Votre note :</p>
                {renderStars(userRating, true, setUserRating)}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Commentaire (optionnel) :
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce cours..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={submitRating}
                  disabled={userRating === 0}
                  style={{
                    backgroundColor: userRating > 0 ? '#548C2F' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: userRating > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Envoyer l'évaluation
                </button>
                <button
                  onClick={() => setShowRatingForm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Passer
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Vue détail du cours
  if (selectedCourse && !courseStarted) {
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
          <h1 style={{ margin: 0, fontSize: '24px' }}>📚 {selectedCourse.title}</h1>
          <button
            onClick={() => setSelectedCourse(null)}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Retour aux cours
          </button>
        </header>

        {/* Course content */}
        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                backgroundColor: '#548C2F',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {selectedCourse.category}
              </span>
              {selectedCourse.isPremium && (
                <span style={{
                  backgroundColor: '#F9A620',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  marginLeft: '10px'
                }}>
                  Premium
                </span>
              )}
            </div>

            <h2 style={{ color: '#548C2F', marginBottom: '15px' }}>
              {selectedCourse.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              {renderStars(selectedCourse.rating)}
              <span style={{ color: '#666' }}>
                {selectedCourse.rating}/5 ({selectedCourse.totalRatings} avis)
              </span>
            </div>

            <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
              {selectedCourse.summary}
            </p>

            <p style={{ marginBottom: '30px' }}>
              <strong>Durée :</strong> {selectedCourse.duration}
            </p>

            {/* Course sections */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#548C2F' }}>📋 Programme du cours</h3>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {selectedCourse.sections.map((section, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      Section {index + 1}: {section}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              onClick={startCourse}
              style={{
                backgroundColor: '#548C2F',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🚀 Commencer le cours
            </button>
          </div>
        </main>
      </div>
    )
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
        <h1 style={{ margin: 0, fontSize: '24px' }}>📚 Formation Ecoloop</h1>
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Dashboard
        </button>
      </header>

      {/* Main content */}
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#548C2F', marginBottom: '15px' }}>
            Formations disponibles
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Développez vos compétences en élevage avicole avec nos cours spécialisés.
          </p>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Votre abonnement :</strong> {user.subscription} 
              {user.subscription === 'free' && ' (Mise à niveau pour accéder aux cours premium)'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des cours...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {courses.map(course => (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: canAccessCourse(course) ? 'pointer' : 'not-allowed',
                  opacity: canAccessCourse(course) ? 1 : 0.6,
                  border: canAccessCourse(course) ? 'none' : '2px dashed #ccc'
                }}
                onClick={() => handleCourseClick(course)}
              >
                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    backgroundColor: '#548C2F',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {course.category}
                  </span>
                  {course.isPremium && (
                    <span style={{
                      backgroundColor: '#F9A620',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}>
                      Premium
                    </span>
                  )}
                </div>

                <h3 style={{ color: '#548C2F', marginBottom: '10px' }}>
                  {course.title}
                </h3>

                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                  {course.summary}
                </p>

                <p style={{ 
                  fontSize: '12px', 
                  color: '#999',
                  marginBottom: '15px' 
                }}>
                  Durée: {course.duration}
                </p>

                {!canAccessCourse(course) && (
                  <p style={{
                    color: '#F9A620',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '15px'
                  }}>
                    🔒 Mise à niveau requise
                  </p>
                )}

                <button
                  style={{
                    backgroundColor: canAccessCourse(course) ? '#548C2F' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: canAccessCourse(course) ? 'pointer' : 'not-allowed',
                    width: '100%'
                  }}
                  disabled={!canAccessCourse(course)}
                >
                  {canAccessCourse(course) ? 'Accéder au cours' : 'Abonnement requis'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default FormationPage
