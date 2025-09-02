import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  Activity, 
  MessageSquare, 
  Settings,
  Shield,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'

const Sidebar = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigationItems = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: t('training'),
      href: '/training',
      icon: BookOpen,
      current: location.pathname === '/training',
      badge: 'Free'
    },
    {
      name: t('tracking'),
      href: '/tracking',
      icon: TrendingUp,
      current: location.pathname === '/tracking',
      badge: 'Pro',
      requiresSubscription: ['pro', 'premium']
    },
    {
      name: t('monitoring'),
      href: '/monitoring',
      icon: Activity,
      current: location.pathname === '/monitoring',
      badge: 'Premium',
      requiresSubscription: ['premium']
    },
    {
      name: t('forum'),
      href: '/forum',
      icon: MessageSquare,
      current: location.pathname === '/forum'
    }
  ]

  const adminItems = [
    {
      name: 'Administration',
      href: '/admin',
      icon: Shield,
      current: location.pathname.startsWith('/admin')
    }
  ]

  const isAccessible = (item) => {
    if (!item.requiresSubscription) return true
    return item.requiresSubscription.includes(user?.subscription)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <img
          className="h-8 w-auto"
          src="/images/logo.png"
          alt="EcoLoop"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <div className="ml-2 text-xl font-bold text-green-600 dark:text-green-400" style={{display: 'none'}}>
          EcoLoop
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isAccessibleItem = isAccessible(item)
          
          return (
            <NavLink
              key={item.name}
              to={isAccessibleItem ? item.href : '#'}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                    : isAccessibleItem
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`
              }
              onClick={(e) => {
                if (!isAccessibleItem) {
                  e.preventDefault()
                }
                setIsMobileOpen(false)
              }}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  item.current
                    ? 'text-green-600 dark:text-green-400'
                    : isAccessibleItem
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
              <span className="flex-1">{item.name}</span>
              
              {item.badge && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  item.badge === 'Free'
                    ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    : item.badge === 'Pro'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {item.badge}
                </span>
              )}
              
              {!isAccessibleItem && (
                <span className="ml-2 text-xs text-orange-500 dark:text-orange-400">
                  🔒
                </span>
              )}
            </NavLink>
          )
        })}

        {/* Admin section */}
        {user?.role === 'admin' && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Administration
              </h3>
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.current
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Subscription info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Plan: {t(user?.subscription || 'free')}
            </div>
            {user?.subscription !== 'premium' && (
              <button className="text-xs text-green-600 dark:text-green-400 hover:underline">
                {t('upgrade')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isMobileOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white dark:bg-gray-800 shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          onClick={() => setIsMobileOpen(true)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default Sidebar
