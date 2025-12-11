import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Activity,
  Target,
  TrendingUp,
  Layers,
  Info,
  ChevronRight
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock data for models
const tabularModels = {
  'GRU-SVM': {
    accuracy: 96.7,
    f1_score: 96.2,
    precision: 95.8,
    recall: 96.6,
    auc_roc: 98.9,
    confusion_matrix: { tp: 193, tn: 357, fp: 7, fn: 12 },
    description: 'GRU feature extractor + SVM classifier hybrid'
  },
  'SVM RBF': {
    accuracy: 95.4,
    f1_score: 94.8,
    precision: 94.4,
    recall: 95.2,
    auc_roc: 98.1,
    confusion_matrix: { tp: 190, tn: 353, fp: 11, fn: 15 },
    description: 'Support Vector Machine with optimized RBF kernel'
  },
  'Random Forest': {
    accuracy: 94.8,
    f1_score: 94.1,
    precision: 93.6,
    recall: 94.6,
    auc_roc: 97.6,
    confusion_matrix: { tp: 188, tn: 351, fp: 13, fn: 17 },
    description: 'Random Forest ensemble classifier'
  },
  'Neural Network L1': {
    accuracy: 93.8,
    f1_score: 93.1,
    precision: 92.8,
    recall: 93.4,
    auc_roc: 96.8,
    confusion_matrix: { tp: 185, tn: 348, fp: 16, fn: 20 },
    description: 'Neural Network with L1 regularization'
  }
}

const imageModels = {
  'DenseNet': {
    accuracy: 93.8,
    f1_score: 93.1,
    precision: 92.8,
    recall: 93.4,
    auc_roc: 97.2,
    confusion_matrix: { tp: 234, tn: 421, fp: 18, fn: 27 },
    description: 'DenseNet-121 fine-tuned on mammograms'
  },
  'ViT-B': {
    accuracy: 92.6,
    f1_score: 91.8,
    precision: 91.2,
    recall: 92.4,
    auc_roc: 96.4,
    confusion_matrix: { tp: 230, tn: 417, fp: 22, fn: 31 },
    description: 'Vision Transformer Base (16x16 patches)'
  },
  'Swin Transformer': {
    accuracy: 91.9,
    f1_score: 90.8,
    precision: 90.2,
    recall: 91.4,
    auc_roc: 95.8,
    confusion_matrix: { tp: 227, tn: 416, fp: 23, fn: 34 },
    description: 'Shifted window attention mechanism'
  },
  'EfficientNet': {
    accuracy: 94.1,
    f1_score: 93.5,
    precision: 93.1,
    recall: 93.9,
    auc_roc: 97.5,
    confusion_matrix: { tp: 236, tn: 422, fp: 17, fn: 25 },
    description: 'EfficientNet-B4 with compound scaling'
  },
  'Ensemble': {
    accuracy: 95.6,
    f1_score: 95.1,
    precision: 94.8,
    recall: 95.4,
    auc_roc: 98.4,
    confusion_matrix: { tp: 241, tn: 428, fp: 11, fn: 20 },
    description: 'Weighted ensemble of all vision models'
  }
}

// Generate ROC curve data
const generateROCData = (auc) => {
  const points = []
  for (let i = 0; i <= 100; i += 5) {
    const fpr = i / 100
    const power = 1 / (auc / 100) ** 2
    const tpr = Math.min(1, 1 - Math.pow(1 - fpr, power))
    points.push({ fpr: fpr * 100, tpr: tpr * 100 })
  }
  return points
}

const COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#14b8a6', '#f59e0b']

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tabular')
  const [selectedModel, setSelectedModel] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Fetch metrics from API
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch {
      // Use mock data
      setMetrics({ tabular: tabularModels, image: imageModels })
    }
  }

  const currentModels = activeTab === 'tabular' ? tabularModels : imageModels

  // Prepare comparison chart data
  const comparisonData = Object.entries(currentModels).map(([name, data]) => ({
    name: name.length > 12 ? name.slice(0, 12) + '...' : name,
    fullName: name,
    accuracy: data.accuracy,
    f1_score: data.f1_score,
    auc_roc: data.auc_roc
  }))

  // Prepare ROC curve data for selected model or all models
  const rocData = selectedModel
    ? generateROCData(currentModels[selectedModel].auc_roc)
    : null

  const allROCData = Object.entries(currentModels).map(([name, data], idx) => ({
    name,
    data: generateROCData(data.auc_roc),
    color: COLORS[idx % COLORS.length]
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Model Performance Dashboard
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Compare accuracy, F1 scores, ROC curves, and confusion matrices across all models
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => { setActiveTab('tabular'); setSelectedModel(null) }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'tabular'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          Tabular Models
        </button>
        <button
          onClick={() => { setActiveTab('image'); setSelectedModel(null) }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          Vision Models
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Best Accuracy', value: `${Math.max(...Object.values(currentModels).map(m => m.accuracy))}%`, icon: Target, color: 'from-pink-500 to-rose-500' },
          { label: 'Best F1 Score', value: `${Math.max(...Object.values(currentModels).map(m => m.f1_score))}%`, icon: Activity, color: 'from-purple-500 to-violet-500' },
          { label: 'Best AUC-ROC', value: `${Math.max(...Object.values(currentModels).map(m => m.auc_roc))}%`, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Models', value: Object.keys(currentModels).length, icon: Layers, color: 'from-emerald-500 to-teal-500' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Model Comparison Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Model Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <XAxis type="number" domain={[80, 100]} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [`${value}%`, name === 'accuracy' ? 'Accuracy' : name === 'f1_score' ? 'F1 Score' : 'AUC-ROC']}
                />
                <Legend />
                <Bar dataKey="accuracy" fill="#ec4899" name="Accuracy" radius={[0, 4, 4, 0]} />
                <Bar dataKey="f1_score" fill="#a855f7" name="F1 Score" radius={[0, 4, 4, 0]} />
                <Bar dataKey="auc_roc" fill="#3b82f6" name="AUC-ROC" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROC Curves */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            ROC Curves
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <XAxis 
                  dataKey="fpr" 
                  type="number" 
                  domain={[0, 100]} 
                  label={{ value: 'False Positive Rate (%)', position: 'bottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="tpr" 
                  type="number" 
                  domain={[0, 100]} 
                  label={{ value: 'True Positive Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                {/* Diagonal reference line */}
                <Line
                  data={[{ fpr: 0, tpr: 0 }, { fpr: 100, tpr: 100 }]}
                  dataKey="tpr"
                  stroke="#e2e8f0"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Random"
                />
                {allROCData.map((model) => (
                  <Line
                    key={model.name}
                    data={model.data}
                    dataKey="tpr"
                    stroke={model.color}
                    strokeWidth={2}
                    dot={false}
                    name={model.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        Individual Model Performance
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(currentModels).map(([name, data], idx) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card rounded-2xl p-6 hover-card cursor-pointer ${
              selectedModel === name ? 'ring-2 ring-pink-500' : ''
            }`}
            onClick={() => setSelectedModel(selectedModel === name ? null : name)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">{name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {data.description}
                </p>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                selectedModel === name ? 'rotate-90' : ''
              }`} />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Accuracy</p>
                <p className="text-lg font-bold text-pink-500">{data.accuracy}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">F1 Score</p>
                <p className="text-lg font-bold text-purple-500">{data.f1_score}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Precision</p>
                <p className="text-lg font-bold text-blue-500">{data.precision}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Recall</p>
                <p className="text-lg font-bold text-cyan-500">{data.recall}%</p>
              </div>
            </div>

            {/* Mini confusion matrix */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Confusion Matrix
              </p>
              <div className="grid grid-cols-2 gap-1 text-center text-xs">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-700 dark:text-emerald-300">
                  TP: {data.confusion_matrix.tp}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300">
                  FP: {data.confusion_matrix.fp}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300">
                  FN: {data.confusion_matrix.fn}
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-700 dark:text-emerald-300">
                  TN: {data.confusion_matrix.tn}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dataset Info */}
      <div className="mt-8 glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Dataset Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">
              Tabular Data - Wisconsin Breast Cancer Dataset
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• 569 samples (357 Benign, 212 Malignant)</li>
              <li>• 30 numeric features per sample</li>
              <li>• Features: radius, texture, perimeter, area, etc.</li>
              <li>• 80/20 train-test split</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">
              Image Data - Mammogram Dataset
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• 700 mammogram images (439 Benign, 261 Malignant)</li>
              <li>• Resolution: 224x224 pixels</li>
              <li>• Data augmentation: rotation, flip, scale</li>
              <li>• 70/15/15 train-val-test split</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

