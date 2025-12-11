import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileSpreadsheet, 
  Image, 
  BarChart3, 
  ArrowRight,
  Brain,
  Cpu,
  Layers,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Advanced ML models trained on clinical tabular data for accurate diagnosis'
  },
  {
    icon: Cpu,
    title: 'Deep Learning',
    description: 'State-of-the-art vision transformers and CNNs for mammogram analysis'
  },
  {
    icon: Layers,
    title: 'Ensemble Learning',
    description: 'Combined predictions from multiple models for improved accuracy'
  }
]

const stats = [
  { value: '96.7%', label: 'Accuracy', color: 'from-pink-500 to-rose-500' },
  { value: '5+', label: 'Tabular Models', color: 'from-purple-500 to-violet-500' },
  { value: '5+', label: 'Vision Models', color: 'from-blue-500 to-cyan-500' },
  { value: '< 2s', label: 'Prediction Time', color: 'from-emerald-500 to-teal-500' }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl" />
        <div className="absolute inset-0 animated-bg" />
        
        <div className="relative glass-card rounded-3xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-medium mb-6"
              >
                <Shield className="w-4 h-4" />
                AI-Powered Medical Diagnosis
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-slate-800 dark:text-white mb-6 leading-tight">
                AI-Powered{' '}
                <span className="gradient-text">Breast Cancer</span>
                <br />
                Diagnosis Platform
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
                Harness the power of machine learning and deep learning for accurate 
                breast cancer diagnosis. Analyze clinical data or mammogram images 
                with state-of-the-art AI models.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/tabular">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 transition-shadow"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Clinical Data Analysis
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                
                <Link to="/image">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    Mammogram Analysis
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Right illustration */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="relative w-64 h-64 lg:w-80 lg:h-80"
              >
                {/* Animated circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-pink-400/30 to-purple-500/30 animate-pulse-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-purple-400/40 to-blue-500/40 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pink-500/40">
                    <Brain className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                  </div>
                </div>
                
                {/* Floating icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
                >
                  <Zap className="w-6 h-6 text-amber-500" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-4 left-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="glass-card rounded-2xl p-6 hover-card"
          >
            <div className={`text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Features */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-pink-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/tabular" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden glass-card rounded-2xl p-6 hover-card group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <FileSpreadsheet className="w-10 h-10 text-pink-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Predict from Clinical Data
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Enter Wisconsin dataset features for diagnosis
              </p>
              <div className="flex items-center text-pink-500 text-sm font-medium">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </Link>

          <Link to="/image" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden glass-card rounded-2xl p-6 hover-card group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <Image className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Predict from Mammogram
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Upload mammogram image for AI analysis
              </p>
              <div className="flex items-center text-purple-500 text-sm font-medium">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </Link>

          <Link to="/dashboard" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden glass-card rounded-2xl p-6 hover-card group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Model Performance
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                View metrics, ROC curves, and comparisons
              </p>
              <div className="flex items-center text-blue-500 text-sm font-medium">
                View Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 border-l-4 border-amber-500"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
              Medical Disclaimer
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This platform is for educational and research purposes only. It should not be used 
              as a substitute for professional medical advice, diagnosis, or treatment. Always 
              consult a qualified healthcare provider for medical decisions.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


