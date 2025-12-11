import { Moon, Sun, Menu, Bell, Search, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass-card border-b border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search features, models..."
              className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 w-64 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>

          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </motion.button>

          {/* User avatar */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Dr. Smith</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Radiologist</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}


