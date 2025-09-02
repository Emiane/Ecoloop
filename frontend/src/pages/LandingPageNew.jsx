import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, TrendingUp, Activity, MessageSquare, Shield, Users, Star, ChevronRight } from 'lucide-react'

const LandingPageNew = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Formation Spécialisée',
      description: 'Maîtrisez l\'élevage de poulets de chair : nutrition, housing, santé et commercialisation',
      badge: 'Gratuit'
    },
    {
      icon: TrendingUp,
      title: 'Suivi de Performance',
      description: 'Trackez la croissance, l\'indice de conversion et la rentabilité de vos lots',
      badge: 'Pro'
    },
    {
      icon: Activity,
      title: 'Monitoring Intelligent',
      description: 'Surveillance automatique de l\'environnement et alertes en temps réel',
      badge: 'Premium'
    },
    {
      icon: MessageSquare,
      title: 'Communauté d\'Éleveurs',
      description: 'Échangez avec des experts et partagez vos expériences d\'élevage',
      badge: 'Gratuit'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="EcoLoop Logo" 
                className="w-10 h-10 rounded-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2316a34a" rx="12"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-weight="bold">E</text></svg>'
                }}
              />
              <span className="text-2xl font-bold text-green-600">EcoLoop</span>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">Poulets de Chair</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Fonctionnalités</a>
              <Link to="/login" className="text-gray-600 hover:text-green-600 transition-colors">Connexion</Link>
              <Link to="/signup" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                S'inscrire
              </Link>
            </nav>

            <div className="md:hidden">
              <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Plateforme #1 au Cameroun
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Optimisez votre
                <span className="text-green-600 block">élevage de poulets de chair</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La plateforme #1 au Cameroun pour la gestion complète de votre élevage de poulets de chair.
                De l'éclosion à la commercialisation, maîtrisez chaque étape pour maximiser votre rentabilité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/dashboard" 
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  to="/training" 
                  className="border border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  Formation gratuite
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  <span>2,500+ éleveurs</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>4.9/5 étoiles</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  <span>100% sécurisé</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tableau de bord</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">En direct</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,250</div>
                      <div className="text-sm text-gray-600">Poules pondeuses</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">98.5%</div>
                      <div className="text-sm text-gray-600">Taux de ponte</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">📊 Graphiques en temps réel</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium">
                🏆 +40% de rendement
              </div>
              <div className="absolute -bottom-4 -left-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                💡 Conseils d'experts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Inspiration avec image */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                L'excellence de l'élevage de poulets de chair au Cameroun
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Nos méthodes éprouvées et notre technologie de pointe vous permettent d'atteindre 
                des performances exceptionnelles : croissance optimale, faible mortalité et rentabilité maximale.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Suivi en temps réel de la croissance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Optimisation automatique de l'alimentation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Alertes préventives santé et environnement</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/inspire.jpg" 
                alt="Élevage moderne de poulets de chair"
                className="rounded-2xl shadow-xl w-full h-auto"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f3f4f6"/><text x="300" y="200" text-anchor="middle" fill="%236b7280" font-size="24">Élevage de poulets de chair</text></svg>'
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-sm text-gray-600 mb-1">Rendement moyen</div>
                <div className="text-2xl font-bold text-green-600">2.1 kg</div>
                <div className="text-sm text-gray-500">en 42 jours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète conçue spécialement pour les éleveurs de volaille au Cameroun
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const moduleLinks = {
                'Formation Complète': '/training',
                'Suivi Intelligent': '/tracking', 
                'Surveillance Avancée': '/monitoring',
                'Forum Communautaire': '/forum'
              };
              
              return (
                <Link 
                  key={index} 
                  to={moduleLinks[feature.title] || '/dashboard'}
                  className="relative group block"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feature.badge === 'Gratuit' 
                          ? 'bg-gray-100 text-gray-600' 
                          : feature.badge === 'Pro'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">Essayer maintenant</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à transformer votre élevage ?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Rejoignez plus de 2,500 éleveurs qui font déjà confiance à EcoLoop
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Accéder au Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/training"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              Formation gratuite
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold">EcoLoop</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour l'élevage de volaille au Cameroun.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                <li><Link to="/signup" className="hover:text-white">S'inscrire</Link></li>
                <li><Link to="/login" className="hover:text-white">Se connecter</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">Conditions</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoLoop Cameroun. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageNew
