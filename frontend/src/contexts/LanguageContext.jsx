import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation data
const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.training': 'Formation',
    'nav.tracking': 'Suivi',
    'nav.monitoring': 'Surveillance',
    'nav.forum': 'Forum',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Landing Page
    'landing.title': 'Élevage Intelligent de Volaille',
    'landing.subtitle': 'Optimisez votre production avicole avec Ecoloop',
    'landing.description': 'Formation complète, suivi personnalisé et surveillance automatisée pour réussir votre élevage de poulets de chair au Cameroun.',
    'landing.getStarted': 'Commencer',
    'landing.learnMore': 'En savoir plus',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.city': 'Ville',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.noAccount': 'Pas de compte ?',
    'auth.hasAccount': 'Déjà un compte ?',
    'auth.createAccount': 'Créer un compte',
    'auth.signIn': 'Se connecter',
    
    // Training
    'training.title': 'Formation Avicole',
    'training.breeding': 'Élevage',
    'training.housing': 'Logement',
    'training.feeding': 'Alimentation',
    'training.vaccination': 'Vaccination',
    'training.diseases': 'Maladies',
    'training.hygiene': 'Hygiène',
    'training.business': 'Business',
    'training.equipment': 'Équipements',
    'training.chatbot': 'Assistant IA',
    
    // Tracking
    'tracking.title': 'Suivi de Production',
    'tracking.analysis': 'Analyse',
    'tracking.planning': 'Planification',
    'tracking.daily': 'Suivi Quotidien',
    'tracking.statistics': 'Statistiques',
    'tracking.lots': 'Gestion des Lots',
    
    // Monitoring
    'monitoring.title': 'Surveillance',
    'monitoring.dashboard': 'Tableau de bord',
    'monitoring.temperature': 'Température',
    'monitoring.humidity': 'Humidité',
    'monitoring.alerts': 'Alertes',
    'monitoring.camera': 'Caméra',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.close': 'Fermer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Attention',
    'common.info': 'Information',
    
    // Subscription
    'subscription.free': 'Gratuit',
    'subscription.pro': 'Pro',
    'subscription.premium': 'Premium',
    'subscription.upgrade': 'Améliorer',
    'subscription.current': 'Actuel',
    
    // Cities in Cameroon
    'cities.yaounde': 'Yaoundé',
    'cities.douala': 'Douala',
    'cities.bamenda': 'Bamenda',
    'cities.garoua': 'Garoua',
    'cities.maroua': 'Maroua',
    'cities.bafoussam': 'Bafoussam',
    'cities.ngaoundere': 'Ngaoundéré',
    'cities.bertoua': 'Bertoua',
    'cities.ebolowa': 'Ebolowa',
    'cities.kumba': 'Kumba',
  },
  
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.training': 'Training',
    'nav.tracking': 'Tracking',
    'nav.monitoring': 'Monitoring',
    'nav.forum': 'Forum',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.title': 'Smart Poultry Farming',
    'landing.subtitle': 'Optimize your poultry production with Ecoloop',
    'landing.description': 'Comprehensive training, personalized tracking and automated monitoring to succeed in your broiler farming in Cameroon.',
    'landing.getStarted': 'Get Started',
    'landing.learnMore': 'Learn More',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.city': 'City',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'No account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    'auth.signIn': 'Sign In',
    
    // Training
    'training.title': 'Poultry Training',
    'training.breeding': 'Breeding',
    'training.housing': 'Housing',
    'training.feeding': 'Feeding',
    'training.vaccination': 'Vaccination',
    'training.diseases': 'Diseases',
    'training.hygiene': 'Hygiene',
    'training.business': 'Business',
    'training.equipment': 'Equipment',
    'training.chatbot': 'AI Assistant',
    
    // Tracking
    'tracking.title': 'Production Tracking',
    'tracking.analysis': 'Analysis',
    'tracking.planning': 'Planning',
    'tracking.daily': 'Daily Tracking',
    'tracking.statistics': 'Statistics',
    'tracking.lots': 'Lot Management',
    
    // Monitoring
    'monitoring.title': 'Monitoring',
    'monitoring.dashboard': 'Dashboard',
    'monitoring.temperature': 'Temperature',
    'monitoring.humidity': 'Humidity',
    'monitoring.alerts': 'Alerts',
    'monitoring.camera': 'Camera',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    // Subscription
    'subscription.free': 'Free',
    'subscription.pro': 'Pro',
    'subscription.premium': 'Premium',
    'subscription.upgrade': 'Upgrade',
    'subscription.current': 'Current',
    
    // Cities in Cameroon
    'cities.yaounde': 'Yaoundé',
    'cities.douala': 'Douala',
    'cities.bamenda': 'Bamenda',
    'cities.garoua': 'Garoua',
    'cities.maroua': 'Maroua',
    'cities.bafoussam': 'Bafoussam',
    'cities.ngaoundere': 'Ngaoundéré',
    'cities.bertoua': 'Bertoua',
    'cities.ebolowa': 'Ebolowa',
    'cities.kumba': 'Kumba',
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr')

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('ecoloop_language')
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0]
      if (translations[browserLang]) {
        setLanguage(browserLang)
      }
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('ecoloop_language', language)
    
    // Update document language
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
    }
  }

  const t = (key, defaultValue = key) => {
    return translations[language]?.[key] || defaultValue
  }

  const getCurrentTranslations = () => {
    return translations[language] || translations.fr
  }

  const value = {
    language,
    changeLanguage,
    t,
    getCurrentTranslations,
    availableLanguages: Object.keys(translations),
    isRTL: false // Could be extended for Arabic support
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
