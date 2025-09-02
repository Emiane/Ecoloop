import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, TrendingUp, Activity, MessageSquare, User, LogOut } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Formation', href: '/training', icon: BookOpen, badge: 'Gratuit' },
    { name: 'Suivi', href: '/tracking', icon: TrendingUp, badge: 'Pro' },
    { name: 'Surveillance', href: '/monitoring', icon: Activity, badge: 'Premium' },
    { name: 'Forum', href: '/forum', icon: MessageSquare, badge: 'Gratuit' }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EcoLoop</span>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.badge === 'Gratuit'
                      ? 'bg-gray-100 text-gray-600'
                      : item.badge === 'Pro'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Utilisateur connecté</div>
              <div className="text-xs text-gray-500">Plan Gratuit</div>
            </div>
          </div>
          <button 
            onClick={() => {
              // Simple déconnexion locale
              localStorage.removeItem('user')
              window.location.href = '/'
            }}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
