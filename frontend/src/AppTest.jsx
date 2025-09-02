import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import TestPageSimple from './TestPageSimple'

const SimpleLanding = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-6">EcoLoop - Test Simple</h1>
        <p className="text-gray-600 mb-8">Test de base pour vérifier que l'application fonctionne</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Navigation Test</h3>
            <p className="text-gray-600 mb-4">Testez la navigation de base</p>
            <Link 
              to="/test" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Page de test
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">CSS Test</h3>
            <p className="text-gray-600 mb-4">Vérification Tailwind CSS</p>
            <div className="w-full h-4 bg-green-200 rounded">
              <div className="w-1/2 h-4 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SimpleLanding />} />
          <Route path="/test" element={<TestPageSimple />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
