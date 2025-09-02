import React, { useState } from 'react'
import Layout from '../components/LayoutSimple'
import { Plus, TrendingUp, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react'

const TrackingHome = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const flocks = [
    {
      id: 1,
      name: "Lot Pondeuses A",
      type: "Pondeuses",
      count: 250,
      age: "22 semaines",
      lastUpdated: "2025-01-01"
    },
    {
      id: 2,
      name: "Lot Poulets B",
      type: "Poulets de chair",
      count: 500,
      age: "6 semaines",
      lastUpdated: "2024-12-31"
    }
  ]

  const transactions = [
    { id: 1, date: "2025-01-01", type: "Vente", description: "Vente d'œufs", amount: 45000, flock: "Lot Pondeuses A" },
    { id: 2, date: "2024-12-30", type: "Achat", description: "Aliment pondeuses", amount: -25000, flock: "Lot Pondeuses A" },
    { id: 3, date: "2024-12-28", type: "Vente", description: "Vente poulets", amount: 125000, flock: "Lot Poulets B" },
    { id: 4, date: "2024-12-25", type: "Achat", description: "Vaccins", amount: -15000, flock: "Général" }
  ]

  const totalRevenue = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  const profit = totalRevenue - totalExpenses

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi & Gestion</h1>
            <p className="text-gray-600">Gérez vos lots et suivez votre rentabilité</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau lot
          </button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenus totaux</p>
                <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Dépenses totales</p>
                <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <TrendingUp className={`h-6 w-6 ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bénéfice net</p>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {profit.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aperçu des lots
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'finances'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Finances
            </button>
            <button
              onClick={() => setActiveTab('production')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'production'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Production
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flocks.map((flock) => (
              <div key={flock.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{flock.name}</h3>
                    <p className="text-sm text-gray-600">{flock.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nombre:</span>
                    <span className="font-medium">{flock.count} volailles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Âge:</span>
                    <span className="font-medium">{flock.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernière MAJ:</span>
                    <span className="font-medium">{flock.lastUpdated}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle transaction
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'Vente' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.flock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi de production</h3>
            <p className="text-gray-600 mb-4">
              Enregistrez et suivez votre production quotidienne d'œufs, 
              croissance des volailles et performances de vos lots.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Commencer l'enregistrement
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TrackingHome
