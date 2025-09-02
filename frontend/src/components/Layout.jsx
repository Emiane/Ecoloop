import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  TrendingUp, 
  Monitor, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Crown,
  Sun,
  Moon,
  Globe
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, canAccessFeature } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, language, changeLanguage } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: Home,
      access: 'free'
    },
    {
      name: t('nav.training'),
      href: '/training',
      icon: BookOpen,
      access: 'free'
    },
    {
      name: t('nav.tracking'),
      href: '/tracking',
      icon: TrendingUp,
      access: 'pro',
      badge: 'PRO'
    },
    {
      name: t('nav.monitoring'),
      href: '/monitoring',
      icon: Monitor,
      access: 'premium',
      badge: 'PREMIUM'
    },
    {
      name: t('nav.forum'),
      href: '/forum',
      icon: MessageSquare,
      access: 'free'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActivePage = (href) => {
    return location.pathname.startsWith(href)
  }

  const getSubscriptionBadge = () => {
    const subscription = user?.subscription || 'free'
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-orange-web text-white',
      premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[subscription]}`}>
        {t(`subscription.${subscription}`).toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/images/logo.png"
              alt="Ecoloop"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <span className="ml-2 text-xl font-bold text-gradient">Ecoloop</span>
          </div>

          {/* User info */}
          <div className="px-4 mt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="mt-1">
                  {getSubscriptionBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const canAccess = canAccessFeature(item.access === 'free' ? 'training' : 
                               item.access === 'pro' ? 'tracking' : 'monitoring')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActivePage(item.href)
                      ? 'bg-primary text-white'
                      : canAccess
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!canAccess) {
                      e.preventDefault()
                    }
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.badge && !canAccess && (
                    <span className="ml-auto px-2 py-1 text-xs font-medium bg-orange-web text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom actions */}
          <div className="flex-shrink-0 px-2 space-y-1">
            <Link
              to="/profile"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="mr-3 h-5 w-5" />
              {t('nav.profile')}
            </Link>
            <Link
              to="/settings"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="mr-3 h-5 w-5" />
              {t('nav.settings')}
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-yellow-700 hover:bg-yellow-50"
              >
                <Crown className="mr-3 h-5 w-5" />
                Admin
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            {/* Mobile sidebar content - same as desktop */}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1" />
            
            {/* Right side controls */}
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => changeLanguage(language === 'fr' ? 'en' : 'fr')}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={`Switch to ${language === 'fr' ? 'English' : 'Français'}`}
                >
                  <Globe className="h-5 w-5" />
                  <span className="ml-1 text-xs font-medium">
                    {language.toUpperCase()}
                  </span>
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
