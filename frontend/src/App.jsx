import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import TabularPrediction from './pages/TabularPrediction'
import ImagePrediction from './pages/ImagePrediction'
import Dashboard from './pages/Dashboard'
import Glossary from './pages/Glossary'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          {/* Main content */}
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            {/* Top navbar */}
            <Navbar 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            
            {/* Page content */}
            <main className="p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tabular" element={<TabularPrediction />} />
                <Route path="/image" element={<ImagePrediction />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/glossary" element={<Glossary />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App


