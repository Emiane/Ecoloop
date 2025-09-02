import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  BookOpen, 
  TrendingUp, 
  Monitor, 
  MessageSquare,
  Award,
  Clock,
  Users,
  BarChart3,
  Calendar,
  Bell,
  Crown,
  Zap
} from 'lucide-react'

const Dashboard = () => {
  const { user, canAccessFeature } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    trainingProgress: 0,
    activeLots: 0,
    forumPosts: 0,
    totalUsers: 1247
  })

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        trainingProgress: 75,
        activeLots: canAccessFeature('tracking') ? 2 : 0,
        forumPosts: 45,
        totalUsers: 1247
      })
    }, 1000)
  }, [canAccessFeature])

  const quickActions = [
    {
      title: t('dashboard.quickActions.startTraining', 'Commencer la Formation'),
      description: t('dashboard.quickActions.startTrainingDesc', 'Apprenez les bases de l\'élevage'),
      href: '/training',
      icon: BookOpen,
      color: 'bg-blue-500',
      available: true
    },
    {
      title: t('dashboard.quickActions.createLot', 'Créer un Lot'),
      description: t('dashboard.quickActions.createLotDesc', 'Démarrez un nouveau cycle d\'élevage'),
      href: '/tracking/analysis',
      icon: TrendingUp,
      color: 'bg-orange-web',
      available: canAccessFeature('tracking'),
      badge: 'PRO'
    },
    {
      title: t('dashboard.quickActions.monitoring', 'Surveillance'),
      description: t('dashboard.quickActions.monitoringDesc', 'Surveillez votre poulailler en temps réel'),
      href: '/monitoring',
      icon: Monitor,
      color: 'bg-forest-green',
      available: canAccessFeature('monitoring'),
      badge: 'PREMIUM'
    },
    {
      title: t('dashboard.quickActions.forum', 'Rejoindre le Forum'),
      description: t('dashboard.quickActions.forumDesc', 'Échangez avec la communauté'),
      href: '/forum',
      icon: MessageSquare,
      color: 'bg-mustard',
      available: true
    }
  ]

  const recentActivities = [
    {
      type: 'training',
      title: 'Vaccination des poulets de chair',
      time: '2 heures',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      type: 'forum',
      title: 'Nouveau post dans Maladies',
      time: '5 heures',
      icon: MessageSquare,
      color: 'text-mustard'
    },
    {
      type: 'tracking',
      title: 'Lot #1 - Jour 25/42',
      time: '1 jour',
      icon: TrendingUp,
      color: 'text-orange-web'
    }
  ]

  const subscriptionBenefits = {
    free: [
      'Formation complète gratuite',
      'Assistant chatbot basique',
      'Accès au forum communautaire',
      'Calendrier de vaccination'
    ],
    pro: [
      'Tout du plan Gratuit',
      'Suivi personnalisé des lots',
      'Analyses et recommandations',
      'Notifications intelligentes',
      'Support prioritaire'
    ],
    premium: [
      'Tout du plan Pro',
      'Surveillance temps réel',
      'Capteurs IoT intégrés',
      'Alertes automatiques',
      'Contrôle à distance',
      'Conseils d\'expert personnalisés'
    ]
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('dashboard.greeting.morning', 'Bonjour')
    if (hour < 18) return t('dashboard.greeting.afternoon', 'Bon après-midi')
    return t('dashboard.greeting.evening', 'Bonsoir')
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-forest-green rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.firstName} !
            </h1>
            <p className="text-white/90 text-lg">
              {t('dashboard.welcome', 'Bienvenue sur votre tableau de bord Ecoloop')}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalUsers}+</div>
              <div className="text-sm text-white/80">Éleveurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/80">Taux de réussite</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Crown className="h-5 w-5 mr-2 text-orange-web" />
            {t('dashboard.subscription.title', 'Votre Abonnement')}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            user?.subscription === 'premium' 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
              : user?.subscription === 'pro'
              ? 'bg-orange-web text-white'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {t(`subscription.${user?.subscription || 'free'}`).toUpperCase()}
          </span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(subscriptionBenefits).map(([plan, benefits]) => (
            <div key={plan} className={`p-4 rounded-xl border-2 ${
              user?.subscription === plan 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200'
            }`}>
              <h3 className="font-semibold mb-2 capitalize flex items-center">
                {t(`subscription.${plan}`)}
                {user?.subscription === plan && (
                  <Zap className="h-4 w-4 ml-1 text-primary" />
                )}
              </h3>
              <ul className="space-y-1">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
                {benefits.length > 3 && (
                  <li className="text-sm text-gray-500">
                    +{benefits.length - 3} autres avantages
                  </li>
                )}
              </ul>
              {user?.subscription !== plan && (
                <button className="mt-3 w-full text-sm btn-outline">
                  {plan === 'free' ? 'Actuel' : t('subscription.upgrade')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.trainingProgress}%</div>
          <div className="text-gray-600 text-sm">Formation Complétée</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-web/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-orange-web" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeLots}</div>
          <div className="text-gray-600 text-sm">Lots Actifs</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-forest-green/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Monitor className="h-6 w-6 text-forest-green" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">24°C</div>
          <div className="text-gray-600 text-sm">Température Moyenne</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-mustard/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="h-6 w-6 text-mustard" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.forumPosts}</div>
          <div className="text-gray-600 text-sm">Posts Forum</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">
          {t('dashboard.quickActions.title', 'Actions Rapides')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const isDisabled = !action.available
            
            return (
              <Link
                key={index}
                to={action.href}
                className={`card-hover text-center relative ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault()
                }}
              >
                {action.badge && isDisabled && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-orange-web text-white text-xs font-medium rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  isDisabled ? 'grayscale' : ''
                }`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t('dashboard.recentActivity', 'Activité Récente')}
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${activity.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-600">Il y a {activity.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <Link 
            to="/profile" 
            className="block text-center mt-4 text-primary hover:text-primary/80 font-medium"
          >
            Voir toute l'activité
          </Link>
        </div>

        {/* Daily Tips */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            {t('dashboard.dailyTip', 'Conseil du Jour')}
          </h2>
          <div className="bg-gradient-to-r from-primary/10 to-forest-green/10 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Température Optimale
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Maintenez une température de 32-35°C la première semaine, puis réduisez de 3°C chaque semaine jusqu'à atteindre 20-24°C.
            </p>
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              Conseil valable pour la phase de démarrage
            </div>
          </div>
          
          {/* Weather Alert */}
          <div className="bg-orange-web/10 border border-orange-web/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Bell className="h-4 w-4 text-orange-web mr-2" />
              <span className="font-medium text-orange-web">Alerte Météo</span>
            </div>
            <p className="text-sm text-gray-700">
              Températures élevées prévues cette semaine à {user?.city}. 
              Assurez-vous que la ventilation est optimale.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
