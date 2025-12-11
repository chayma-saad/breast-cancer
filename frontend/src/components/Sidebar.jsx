import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  FileSpreadsheet, 
  Image, 
  BarChart3, 
  Book,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home', description: 'Dashboard overview' },
  { path: '/tabular', icon: FileSpreadsheet, label: 'Clinical Data', description: 'Tabular prediction' },
  { path: '/image', icon: Image, label: 'Mammogram', description: 'Image analysis' },
  { path: '/dashboard', icon: BarChart3, label: 'Performance', description: 'Model metrics' },
  { path: '/glossary', icon: Book, label: 'Glossary', description: 'Medical terms' },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-full z-50 glass-card border-r border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                BreastAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Diagnosis Platform</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 text-pink-600 dark:text-pink-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="font-medium text-sm truncate">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Toggle button */}
        <div className="px-3 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isOpen ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}


