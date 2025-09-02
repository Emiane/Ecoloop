import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  TrendingUp, 
  Monitor, 
  MessageSquare,
  Star,
  Users,
  Award,
  Globe,
  Sun,
  Moon
} from 'lucide-react'

const LandingPage = () => {
  const { isAuthenticated } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  const features = [
    {
      icon: BookOpen,
      title: t('landing.features.training.title', 'Formation Complète'),
      description: t('landing.features.training.desc', 'Apprenez les meilleures pratiques d\'élevage avec nos guides détaillés et notre assistant IA.'),
      color: 'bg-blue-500'
    },
    {
      icon: TrendingUp,
      title: t('landing.features.tracking.title', 'Suivi Personnalisé'),
      description: t('landing.features.tracking.desc', 'Planifiez et suivez votre production jour par jour avec des recommandations adaptées.'),
      color: 'bg-orange-web'
    },
    {
      icon: Monitor,
      title: t('landing.features.monitoring.title', 'Surveillance Automatisée'),
      description: t('landing.features.monitoring.desc', 'Surveillez l\'environnement de vos volailles en temps réel avec des capteurs intelligents.'),
      color: 'bg-forest-green'
    },
    {
      icon: MessageSquare,
      title: t('landing.features.forum.title', 'Communauté Active'),
      description: t('landing.features.forum.desc', 'Échangez avec d\'autres éleveurs et obtenez des conseils d\'experts.'),
      color: 'bg-mustard'
    }
  ]

  const stats = [
    { number: '1000+', label: t('landing.stats.users', 'Utilisateurs actifs') },
    { number: '50+', label: t('landing.stats.articles', 'Articles de formation') },
    { number: '95%', label: t('landing.stats.success', 'Taux de réussite') },
    { number: '24/7', label: t('landing.stats.support', 'Support disponible') }
  ]

  const testimonials = [
    {
      name: 'Marie Kouam',
      city: 'Douala',
      text: 'Ecoloop m\'a aidée à optimiser ma production de poulets de chair. Je recommande vivement !',
      rating: 5
    },
    {
      name: 'Jean Baptiste',
      city: 'Yaoundé',
      text: 'Grâce aux formations et au suivi quotidien, j\'ai augmenté ma productivité de 40%.',
      rating: 5
    },
    {
      name: 'Fatima Bello',
      city: 'Garoua',
      text: 'L\'assistant IA répond à toutes mes questions. C\'est comme avoir un vétérinaire à portée de main.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige via-white to-light-blue">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Ecoloop"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div className="hidden">
                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
              </div>
              <span className="ml-3 text-2xl font-bold text-gradient">Ecoloop</span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Language switcher */}
              <button
                onClick={() => changeLanguage(language === 'fr' ? 'en' : 'fr')}
                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                title={`Switch to ${language === 'fr' ? 'English' : 'Français'}`}
              >
                <Globe className="h-5 w-5" />
                <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Auth buttons */}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t('auth.login')}
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                {t('landing.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text */}
            <div className="animate-fadeIn">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('landing.title')}
                <span className="block text-gradient mt-2">
                  {t('landing.subtitle', 'au Cameroun')}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('landing.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup" className="btn-primary flex items-center justify-center group">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn-outline">
                  {t('landing.learnMore')}
                </button>
              </div>

              {/* Key benefits */}
              <div className="space-y-3">
                {[
                  t('landing.benefits.free', 'Formation 100% gratuite'),
                  t('landing.benefits.local', 'Adapté au contexte camerounais'),
                  t('landing.benefits.support', 'Support expert 24/7')
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-forest-green mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/inspire.jpg"
                  alt="Élevage de volaille moderne"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }}
                />
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-pulse-slow">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Production active</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-gray-600">Taux de survie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.title', 'Fonctionnalités Complètes')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing.features.subtitle', 'Tout ce dont vous avez besoin pour réussir votre élevage de volaille')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card-hover text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.testimonials.title', 'Ils nous font confiance')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('landing.cta.title', 'Prêt à commencer votre élevage ?')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t('landing.cta.subtitle', 'Rejoignez des centaines d\'éleveurs qui ont transformé leur production avec Ecoloop.')}
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            {t('landing.getStarted')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src="/images/logo.png" alt="Ecoloop" className="h-8 w-auto mr-3" />
                <span className="text-xl font-bold">Ecoloop</span>
              </div>
              <p className="text-gray-400 mb-4">
                {t('landing.footer.description', 'Plateforme d\'élevage intelligent pour le Cameroun')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.product', 'Produit')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/training" className="hover:text-white">Formation</Link></li>
                <li><Link to="/tracking" className="hover:text-white">Suivi</Link></li>
                <li><Link to="/monitoring" className="hover:text-white">Surveillance</Link></li>
                <li><Link to="/forum" className="hover:text-white">Forum</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.support', 'Support')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ecoloop. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
