import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const PageHeader = ({ title, subtitle, showBackButton = true, backTo = '/dashboard' }) => {
  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Link 
                  to={backTo}
                  className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="text-sm">Retour</span>
                </Link>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">EcoLoop</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
