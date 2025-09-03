import React, { useState, useEffect } from 'react'

function TrackingPageCameroun({ user, onBack, darkMode = false, language = 'FR' }) {
  const [currentStep, setCurrentStep] = useState('setup') // setup, tracking, history, statistics
  const [cycles, setCycles] = useState([])
  const [currentCycle, setCurrentCycle] = useState(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [showAlert, setShowAlert] = useState(false)
  const [calculationResult, setCalculationResult] = useState(null)

  // Setup form states
  const [selectedPhase, setSelectedPhase] = useState('')
  const [superficie, setSuperficie] = useState('')
  const [customSuperficie, setCustomSuperficie] = useState('')
  const [budget, setBudget] = useState('')
  const [customBudget, setCustomBudget] = useState('')

  // Thème mixte Dashboard + Formation Cameroun
  const colors = {
    lightBlue: '#A8D5E2',
    orangeWeb: '#F9A620',
    mustard: '#FFD449',
    forestGreen: '#548C2F',
    pakistanGreen: '#104911',
    softBeige: '#F2EFE5',
    dashboardGreen: '#2d5a27',
    dashboardSecondary: '#4a8c3a'
  }

  const theme = {
    background: darkMode ? '#1a1a1a' : colors.softBeige,
    cardBg: darkMode ? '#2d2d2d' : '#ffffff',
    primaryGreen: colors.forestGreen,
    darkGreen: colors.pakistanGreen,
    accent: colors.orangeWeb,
    secondary: colors.lightBlue,
    textPrimary: darkMode ? '#fff' : colors.pakistanGreen,
    textSecondary: darkMode ? '#ccc' : '#555555',
    border: darkMode ? '#404040' : '#e8f5e8'
  }

  const translations = {
    FR: {
      backToDashboard: 'Retour au tableau de bord',
      trackingTitle: 'Suivi des Lots - Poulet de Chair',
      newCycle: 'Nouveau Cycle',
      myCycles: 'Mes Cycles',
      history: 'Historique',
      statistics: 'Statistiques',
      selectPhase: 'Sélectionnez la phase d\'exploitation',
      superficie: 'Superficie disponible',
      budget: 'Budget disponible',
      calculate: 'Calculer',
      startTracking: 'Commencer le suivi',
      cancel: 'Annuler',
      day: 'Jour',
      tasks: 'Tâches du jour',
      feeding: 'Alimentation',
      environment: 'Conditions environnementales',
      temperature: 'Température',
      humidity: 'Humidité',
      noSuperficieYet: 'Je n\'ai pas encore de superficie',
      noBudgetYet: 'Je n\'ai pas encore de budget',
      enterCustom: 'Saisir une valeur personnalisée'
    },
    EN: {
      backToDashboard: 'Back to Dashboard',
      trackingTitle: 'Flock Tracking - Broiler Chicken',
      newCycle: 'New Cycle',
      myCycles: 'My Cycles',
      history: 'History',
      statistics: 'Statistics',
      selectPhase: 'Select exploitation phase',
      superficie: 'Available area',
      budget: 'Available budget',
      calculate: 'Calculate',
      startTracking: 'Start tracking',
      cancel: 'Cancel',
      day: 'Day',
      tasks: 'Daily tasks',
      feeding: 'Feeding',
      environment: 'Environmental conditions',
      temperature: 'Temperature',
      humidity: 'Humidity',
      noSuperficieYet: 'I don\'t have area yet',
      noBudgetYet: 'I don\'t have budget yet',
      enterCustom: 'Enter custom value'
    }
  }

  const t = translations[language]

  // Phases d'exploitation
  const phases = [
    { id: 'demarrage', name: 'Démarrage (0-10 jours)', duration: 10, density: 30 },
    { id: 'croissance', name: 'Croissance (11-24 jours)', duration: 24, density: 25 },
    { id: 'finition', name: 'Finition (25-42 jours)', duration: 42, density: 20 },
    { id: 'complet', name: 'Cycle complet (0-42 jours)', duration: 42, density: 20 }
  ]

  // Options de superficie (en m²)
  const superficieOptions = [
    { value: '50-100', label: '50-100 m²' },
    { value: '100-200', label: '100-200 m²' },
    { value: '200-500', label: '200-500 m²' },
    { value: '500-1000', label: '500-1000 m²' },
    { value: '1000+', label: 'Plus de 1000 m²' }
  ]

  // Options de budget (en FCFA)
  const budgetOptions = [
    { value: '100000-300000', label: '100,000 - 300,000 FCFA' },
    { value: '300000-500000', label: '300,000 - 500,000 FCFA' },
    { value: '500000-1000000', label: '500,000 - 1,000,000 FCFA' },
    { value: '1000000-2000000', label: '1,000,000 - 2,000,000 FCFA' },
    { value: '2000000+', label: 'Plus de 2,000,000 FCFA' }
  ]

  // Données de tracking par jour (exemple pour démonstration)
  const trackingData = {
    1: {
      image: '/images/poulet-j1.jpg',
      tasks: [
        'Réception des poussins (contrôle qualité)',
        'Mise en éleveuse (température 32-35°C)',
        'Distribution eau + glucose (50g/L)',
        'Vaccination Newcastle + Gumboro',
        'Éclairage 24h/24'
      ],
      feeding: {
        aliment: 'Pré-démarrage',
        quantite: '30-40g/poussin/jour',
        composition: 'Protéines: 23-24%, Énergie: 3000 Kcal/kg'
      },
      environment: {
        temperature: '32-35°C',
        humidity: '60-65%',
        ventilation: 'Minimale'
      },
      costs: {
        aliment: 8400, // en FCFA
        medicaments: 2500,
        energie: 1200
      }
    },
    7: {
      image: '/images/poulet-j7.jpg',
      tasks: [
        'Pesée échantillon (100g minimum attendu)',
        'Nettoyage des abreuvoirs',
        'Contrôle température (30°C)',
        'Observation comportement',
        'Élimination des morts'
      ],
      feeding: {
        aliment: 'Pré-démarrage',
        quantite: '50-60g/poussin/jour',
        composition: 'Protéines: 23-24%, Énergie: 3000 Kcal/kg'
      },
      environment: {
        temperature: '30°C',
        humidity: '60-65%',
        ventilation: 'Légère'
      },
      costs: {
        aliment: 12600,
        medicaments: 0,
        energie: 1100
      }
    },
    14: {
      image: '/images/poulet-j14.jpg',
      tasks: [
        'Changement vers aliment démarrage',
        'Vaccination Newcastle La Sota',
        'Ajustement mangeoires',
        'Contrôle croissance (300g attendu)',
        'Nettoyage litière'
      ],
      feeding: {
        aliment: 'Démarrage',
        quantite: '80-100g/poulet/jour',
        composition: 'Protéines: 21-22%, Énergie: 3100 Kcal/kg'
      },
      environment: {
        temperature: '27°C',
        humidity: '60-65%',
        ventilation: 'Modérée'
      },
      costs: {
        aliment: 18900,
        medicaments: 1500,
        energie: 1000
      }
    },
    21: {
      image: '/images/poulet-j21.jpg',
      tasks: [
        'Pesée contrôle (500g attendu)',
        'Vaccination Gumboro intermédiaire',
        'Réglage hauteur mangeoires',
        'Contrôle sanitaire renforcé',
        'Addition litière fraîche'
      ],
      feeding: {
        aliment: 'Démarrage',
        quantite: '120-140g/poulet/jour',
        composition: 'Protéines: 21-22%, Énergie: 3100 Kcal/kg'
      },
      environment: {
        temperature: '25°C',
        humidity: '60-65%',
        ventilation: 'Bonne'
      },
      costs: {
        aliment: 25200,
        medicaments: 2000,
        energie: 900
      }
    },
    35: {
      image: '/images/poulet-j35.jpg',
      tasks: [
        'Changement aliment croissance',
        'Pesée (1.5kg attendu)',
        'Surveillance sanitaire',
        'Optimisation espace',
        'Préparation phase finale'
      ],
      feeding: {
        aliment: 'Croissance',
        quantite: '160-180g/poulet/jour',
        composition: 'Protéines: 19-20%, Énergie: 3150 Kcal/kg'
      },
      environment: {
        temperature: '23°C',
        humidity: '60-65%',
        ventilation: 'Optimale'
      },
      costs: {
        aliment: 35400,
        medicaments: 0,
        energie: 800
      }
    },
    42: {
      image: '/images/poulet-j42.jpg',
      tasks: [
        'Pesée finale (2-2.5kg attendu)',
        'Arrêt alimentation 12h avant abattage',
        'Préparation enlèvement',
        'Bilan financier',
        'Nettoyage préparatoire'
      ],
      feeding: {
        aliment: 'Finition',
        quantite: '180-200g/poulet/jour',
        composition: 'Protéines: 18-19%, Énergie: 3200 Kcal/kg'
      },
      environment: {
        temperature: '22°C',
        humidity: '60-65%',
        ventilation: 'Maximale'
      },
      costs: {
        aliment: 42000,
        medicaments: 0,
        energie: 700
      }
    }
  }

  const calculateCycle = () => {
    const phase = phases.find(p => p.id === selectedPhase)
    if (!phase) return

    let calculatedSuperficie = 0
    let calculatedBudget = 0
    let calculatedPoultry = 0

    // Calcul de la superficie
    if (superficie === 'custom') {
      calculatedSuperficie = parseFloat(customSuperficie)
    } else if (superficie && superficie !== 'none') {
      const range = superficie.split('-')
      calculatedSuperficie = range.length > 1 ? parseFloat(range[0]) : parseFloat(range[0].replace('+', ''))
    }

    // Calcul du budget
    if (budget === 'custom') {
      calculatedBudget = parseFloat(customBudget)
    } else if (budget && budget !== 'none') {
      const range = budget.split('-')
      calculatedBudget = range.length > 1 ? parseFloat(range[0]) : parseFloat(range[0].replace('+', ''))
    }

    // Calcul du nombre de poulets
    if (calculatedSuperficie > 0) {
      calculatedPoultry = Math.floor(calculatedSuperficie * phase.density)
    } else if (calculatedBudget > 0) {
      // Prix moyen par poussin: 450 FCFA + coûts d'élevage estimés
      const costPerChicken = 450 + (phase.duration * 200) // 200 FCFA/jour/poulet
      calculatedPoultry = Math.floor(calculatedBudget / costPerChicken)
      calculatedSuperficie = Math.ceil(calculatedPoultry / phase.density)
    }

    // Calcul du budget si non fourni
    if (calculatedBudget === 0 && calculatedPoultry > 0) {
      const costPerChicken = 450 + (phase.duration * 200)
      calculatedBudget = calculatedPoultry * costPerChicken
    }

    // Prix de vente estimé
    const sellingPricePerKg = 2500 // FCFA/kg
    const avgWeightAtEnd = 2.2 // kg
    const totalRevenue = calculatedPoultry * avgWeightAtEnd * sellingPricePerKg
    const estimatedProfit = totalRevenue - calculatedBudget

    setCalculationResult({
      phase: phase.name,
      duration: phase.duration,
      superficie: calculatedSuperficie,
      budget: calculatedBudget,
      poultryCount: calculatedPoultry,
      estimatedRevenue: totalRevenue,
      estimatedProfit: estimatedProfit
    })
    setShowAlert(true)
  }

  const startNewCycle = () => {
    const newCycle = {
      id: Date.now(),
      ...calculationResult,
      startDate: new Date(),
      currentDay: 1,
      isActive: true
    }
    setCycles([...cycles, newCycle])
    setCurrentCycle(newCycle)
    setCurrentDay(1)
    setCurrentStep('tracking')
    setShowAlert(false)
  }

  const getTodayData = () => {
    const availableDays = Object.keys(trackingData).map(Number).sort((a, b) => a - b)
    const closestDay = availableDays.reduce((prev, curr) => 
      Math.abs(curr - currentDay) < Math.abs(prev - currentDay) ? curr : prev
    )
    return trackingData[closestDay] || trackingData[1]
  }

  const renderSetupForm = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: theme.cardBg,
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: `2px solid ${theme.secondary}`
      }}>
        <h2 style={{ color: theme.textPrimary, marginBottom: '30px', textAlign: 'center' }}>
          🐣 Configuration du nouveau cycle
        </h2>

        {/* Phase selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: theme.textPrimary }}>
            {t.selectPhase} *
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${theme.secondary}`,
              borderRadius: '8px',
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              fontSize: '16px'
            }}
          >
            <option value="">Choisir une phase...</option>
            {phases.map(phase => (
              <option key={phase.id} value={phase.id}>{phase.name}</option>
            ))}
          </select>
        </div>

        {/* Superficie */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: theme.textPrimary }}>
            {t.superficie}
          </label>
          <select
            value={superficie}
            onChange={(e) => setSuperficie(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${theme.secondary}`,
              borderRadius: '8px',
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              fontSize: '16px',
              marginBottom: '10px'
            }}
          >
            <option value="">Choisir la superficie...</option>
            {superficieOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            <option value="custom">{t.enterCustom}</option>
            <option value="none">{t.noSuperficieYet}</option>
          </select>
          {superficie === 'custom' && (
            <input
              type="number"
              placeholder="Superficie en m²"
              value={customSuperficie}
              onChange={(e) => setCustomSuperficie(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${theme.accent}`,
                borderRadius: '8px',
                backgroundColor: theme.cardBg,
                color: theme.textPrimary
              }}
            />
          )}
        </div>

        {/* Budget */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: theme.textPrimary }}>
            {t.budget}
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${theme.secondary}`,
              borderRadius: '8px',
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              fontSize: '16px',
              marginBottom: '10px'
            }}
          >
            <option value="">Choisir le budget...</option>
            {budgetOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            <option value="custom">{t.enterCustom}</option>
            <option value="none">{t.noBudgetYet}</option>
          </select>
          {budget === 'custom' && (
            <input
              type="number"
              placeholder="Budget en FCFA"
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${theme.accent}`,
                borderRadius: '8px',
                backgroundColor: theme.cardBg,
                color: theme.textPrimary
              }}
            />
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => setCurrentStep('tracking')}
            style={{
              backgroundColor: theme.textSecondary,
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {t.cancel}
          </button>
          <button
            onClick={calculateCycle}
            disabled={!selectedPhase || (superficie === 'none' && budget === 'none')}
            style={{
              backgroundColor: selectedPhase && (superficie !== 'none' || budget !== 'none') ? theme.accent : '#ccc',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              cursor: selectedPhase && (superficie !== 'none' || budget !== 'none') ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📊 {t.calculate}
          </button>
        </div>
      </div>
    </div>
  )

  const renderTrackingView = () => {
    const todayData = getTodayData()
    const phase = phases.find(p => p.id === selectedPhase)
    
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with cycle info */}
        <div style={{
          backgroundColor: theme.primaryGreen,
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              {currentCycle?.phase} - {t.day} {currentDay}/{phase?.duration}
            </h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              {currentCycle?.poultryCount} poulets • {currentCycle?.superficie} m²
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay <= 1}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: currentDay > 1 ? 'pointer' : 'not-allowed'
              }}
            >
              ← Jour précédent
            </button>
            <button
              onClick={() => setCurrentDay(Math.min(phase?.duration || 42, currentDay + 1))}
              disabled={currentDay >= (phase?.duration || 42)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: currentDay < (phase?.duration || 42) ? 'pointer' : 'not-allowed'
              }}
            >
              Jour suivant →
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Photo et tâches */}
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: theme.textPrimary, marginBottom: '15px' }}>
              📸 État des poulets - {t.day} {currentDay}
            </h3>
            <div style={{
              backgroundColor: theme.secondary,
              height: '200px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '18px',
              color: theme.textPrimary
            }}>
              🐔 Photo du jour {currentDay}
              <br/>
              <small>(Image sera chargée automatiquement)</small>
            </div>

            <h4 style={{ color: theme.textPrimary, marginBottom: '10px' }}>{t.tasks}</h4>
            <ul style={{ color: theme.textSecondary, lineHeight: '1.6' }}>
              {todayData.tasks.map((task, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  <input type="checkbox" style={{ marginRight: '8px' }} />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Alimentation et environnement */}
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: theme.textPrimary, marginBottom: '15px' }}>
              🌾 {t.feeding}
            </h3>
            <div style={{
              backgroundColor: theme.background,
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <p><strong>Aliment:</strong> {todayData.feeding.aliment}</p>
              <p><strong>Quantité:</strong> {todayData.feeding.quantite}</p>
              <p><strong>Composition:</strong> {todayData.feeding.composition}</p>
            </div>

            <h4 style={{ color: theme.textPrimary, marginBottom: '10px' }}>{t.environment}</h4>
            <div style={{
              backgroundColor: theme.background,
              padding: '15px',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <p><strong>{t.temperature}:</strong></p>
                  <p style={{ color: theme.accent, fontSize: '18px', fontWeight: 'bold' }}>
                    {todayData.environment.temperature}
                  </p>
                </div>
                <div>
                  <p><strong>{t.humidity}:</strong></p>
                  <p style={{ color: theme.accent, fontSize: '18px', fontWeight: 'bold' }}>
                    {todayData.environment.humidity}
                  </p>
                </div>
              </div>
              <p style={{ marginTop: '10px' }}>
                <strong>Ventilation:</strong> {todayData.environment.ventilation}
              </p>
            </div>
          </div>
        </div>

        {/* Coûts du jour */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '15px' }}>
            💰 Coûts du jour {currentDay}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: theme.background, borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌾</div>
              <div style={{ fontWeight: 'bold', color: theme.accent }}>{todayData.costs.aliment.toLocaleString()} FCFA</div>
              <div style={{ fontSize: '12px', color: theme.textSecondary }}>Alimentation</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: theme.background, borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>💉</div>
              <div style={{ fontWeight: 'bold', color: theme.accent }}>{todayData.costs.medicaments.toLocaleString()} FCFA</div>
              <div style={{ fontSize: '12px', color: theme.textSecondary }}>Médicaments</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: theme.background, borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚡</div>
              <div style={{ fontWeight: 'bold', color: theme.accent }}>{todayData.costs.energie.toLocaleString()} FCFA</div>
              <div style={{ fontSize: '12px', color: theme.textSecondary }}>Énergie</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: theme.primaryGreen, borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px', color: 'white' }}>💳</div>
              <div style={{ fontWeight: 'bold', color: 'white' }}>
                {(todayData.costs.aliment + todayData.costs.medicaments + todayData.costs.energie).toLocaleString()} FCFA
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total jour</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAlert = () => {
    if (!showAlert || !calculationResult) return null

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '20px', textAlign: 'center' }}>
            📊 Récapitulatif du calcul
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Phase:</strong> {calculationResult.phase}</p>
            <p><strong>Durée:</strong> {calculationResult.duration} jours</p>
            <p><strong>Superficie:</strong> {calculationResult.superficie} m²</p>
            <p><strong>Budget:</strong> {calculationResult.budget.toLocaleString()} FCFA</p>
            <p><strong>Nombre de poulets:</strong> {calculationResult.poultryCount}</p>
            <p style={{ color: theme.accent, fontWeight: 'bold' }}>
              <strong>Revenus estimés:</strong> {calculationResult.estimatedRevenue.toLocaleString()} FCFA
            </p>
            <p style={{ color: calculationResult.estimatedProfit > 0 ? theme.primaryGreen : '#dc2626', fontWeight: 'bold' }}>
              <strong>Profit estimé:</strong> {calculationResult.estimatedProfit.toLocaleString()} FCFA
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                backgroundColor: theme.textSecondary,
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              {t.cancel}
            </button>
            <button
              onClick={startNewCycle}
              style={{
                backgroundColor: theme.primaryGreen,
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚀 {t.startTracking}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background }}>
      {/* Header */}
      <header style={{
        backgroundColor: theme.cardBg,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: theme.primaryGreen,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← {t.backToDashboard}
            </button>
            
            <h1 style={{
              color: theme.textPrimary,
              margin: 0,
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              🐣 {t.trackingTitle}
            </h1>
            
            <div style={{ width: '120px' }}></div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button
            onClick={() => setCurrentStep('setup')}
            style={{
              backgroundColor: currentStep === 'setup' ? theme.accent : 'transparent',
              color: currentStep === 'setup' ? 'white' : theme.textPrimary,
              border: `2px solid ${theme.accent}`,
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🆕 {t.newCycle}
          </button>
          <button
            onClick={() => setCurrentStep('tracking')}
            style={{
              backgroundColor: currentStep === 'tracking' ? theme.primaryGreen : 'transparent',
              color: currentStep === 'tracking' ? 'white' : theme.textPrimary,
              border: `2px solid ${theme.primaryGreen}`,
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📊 {t.myCycles}
          </button>
          <button
            onClick={() => setCurrentStep('history')}
            style={{
              backgroundColor: currentStep === 'history' ? theme.secondary : 'transparent',
              color: currentStep === 'history' ? theme.darkGreen : theme.textPrimary,
              border: `2px solid ${theme.secondary}`,
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📚 {t.history}
          </button>
          <button
            onClick={() => setCurrentStep('statistics')}
            style={{
              backgroundColor: currentStep === 'statistics' ? theme.darkGreen : 'transparent',
              color: currentStep === 'statistics' ? 'white' : theme.textPrimary,
              border: `2px solid ${theme.darkGreen}`,
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📈 {t.statistics}
          </button>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
        {currentStep === 'setup' && renderSetupForm()}
        {currentStep === 'tracking' && renderTrackingView()}
        {currentStep === 'history' && (
          <div style={{ textAlign: 'center', padding: '60px', color: theme.textSecondary }}>
            📚 Historique des cycles (à implémenter)
          </div>
        )}
        {currentStep === 'statistics' && (
          <div style={{ textAlign: 'center', padding: '60px', color: theme.textSecondary }}>
            📈 Statistiques et analyses (à implémenter)
          </div>
        )}
      </main>

      {renderAlert()}
    </div>
  )
}

export default TrackingPageCameroun
