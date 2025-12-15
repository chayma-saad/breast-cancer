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
  },
  'MLP': {
    accuracy: 95.5,
    f1_score: 94.9,
    precision: 94.5,
    recall: 95.3,
    auc_roc: 98.2,
    confusion_matrix: { tp: 191, tn: 354, fp: 10, fn: 14 },
    description: 'Multi-layer Perceptron with optimized architecture'
  },
  'Linear Regression': {
    accuracy: 91.2,
    f1_score: 89.8,
    precision: 89.1,
    recall: 90.5,
    auc_roc: 94.3,
    confusion_matrix: { tp: 181, tn: 338, fp: 26, fn: 24 },
    description: 'Logistic Regression with L2 regularization'
  },
  'Softmax Regression': {
    accuracy: 92.4,
    f1_score: 91.2,
    precision: 91.8,
    recall: 90.6,
    auc_roc: 95.8,
    confusion_matrix: { tp: 184, tn: 342, fp: 22, fn: 21 },
    description: 'Tuned Softmax Regression classifier'
  }
}

const imageModels = {
  'Vision Transformer': {
    accuracy: 94.8,
    f1_score: 94.2,
    precision: 93.8,
    recall: 94.6,
    auc_roc: 97.8,
    confusion_matrix: { tp: 237, tn: 424, fp: 15, fn: 24 },
    description: 'Vision Transformer (ViT-B/16) fine-tuned on mammogram dataset'
  },
  'Magnification Aware': {
    accuracy: 95.6,
    f1_score: 95.1,
    precision: 94.8,
    recall: 95.4,
    auc_roc: 98.2,
    confusion_matrix: { tp: 240, tn: 427, fp: 12, fn: 21 },
    description: 'Magnification-aware model that adapts to different image magnifications'
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
      } else {
        // API failed, set empty metrics (will show N/A)
        setMetrics({ tabular_models: {}, image_models: {} })
      }
    } catch {
      // API error, set empty metrics (will show N/A instead of fake data)
      setMetrics({ tabular_models: {}, image_models: {} })
    }
  }

  // Use API metrics if available, otherwise use empty (will show N/A)
  const currentModels = metrics 
    ? (activeTab === 'tabular' ? (metrics.tabular_models || {}) : (metrics.image_models || {}))
    : (activeTab === 'tabular' ? {} : {})

  // Prepare comparison chart data
  const comparisonData = Object.entries(currentModels)
    .filter(([name, data]) => data.accuracy !== null && data.accuracy !== undefined)
    .map(([name, data]) => ({
      name: name.length > 12 ? name.slice(0, 12) + '...' : name,
      fullName: name,
      accuracy: (data.accuracy < 1 ? data.accuracy * 100 : data.accuracy),
      f1_score: (data.f1_score < 1 ? data.f1_score * 100 : data.f1_score),
      auc_roc: (data.auc_roc < 1 ? data.auc_roc * 100 : data.auc_roc)
    }))

  // Prepare ROC curve data for selected model or all models
  const rocData = selectedModel && currentModels[selectedModel]?.auc_roc !== null && currentModels[selectedModel]?.auc_roc !== undefined
    ? (() => {
        const auc = currentModels[selectedModel].auc_roc;
        return generateROCData(auc < 1 ? auc : auc / 100);
      })()
    : null

  const allROCData = Object.entries(currentModels)
    .filter(([name, data]) => data.auc_roc !== null && data.auc_roc !== undefined)
    .map(([name, data], idx) => {
      const auc = data.auc_roc;
      const aucValue = auc < 1 ? auc : auc / 100;
      return {
        name,
        data: generateROCData(aucValue),
        color: COLORS[idx % COLORS.length]
      };
    })

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
          { 
            label: 'Best Accuracy', 
            value: (() => {
              const accuracies = Object.values(currentModels)
                .map(m => m.accuracy)
                .filter(acc => acc !== null && acc !== undefined)
                .map(acc => acc < 1 ? acc * 100 : acc);
              return accuracies.length > 0 
                ? `${Math.max(...accuracies).toFixed(1)}%`
                : 'N/A';
            })(), 
            icon: Target, 
            color: 'from-pink-500 to-rose-500' 
          },
          { 
            label: 'Best F1 Score', 
            value: (() => {
              const f1s = Object.values(currentModels)
                .map(m => m.f1_score)
                .filter(f1 => f1 !== null && f1 !== undefined)
                .map(f1 => f1 < 1 ? f1 * 100 : f1);
              return f1s.length > 0 
                ? `${Math.max(...f1s).toFixed(1)}%`
                : 'N/A';
            })(), 
            icon: Activity, 
            color: 'from-purple-500 to-violet-500' 
          },
          { 
            label: 'Best AUC-ROC', 
            value: (() => {
              const aucs = Object.values(currentModels)
                .map(m => m.auc_roc)
                .filter(auc => auc !== null && auc !== undefined)
                .map(auc => auc < 1 ? auc * 100 : auc);
              return aucs.length > 0 
                ? `${Math.max(...aucs).toFixed(1)}%`
                : 'N/A';
            })(), 
            icon: TrendingUp, 
            color: 'from-blue-500 to-cyan-500' 
          },
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
                <p className="text-lg font-bold text-pink-500">
                  {data.accuracy !== null && data.accuracy !== undefined 
                    ? `${((data.accuracy < 1 ? data.accuracy * 100 : data.accuracy)).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">F1 Score</p>
                <p className="text-lg font-bold text-purple-500">
                  {data.f1_score !== null && data.f1_score !== undefined
                    ? `${((data.f1_score < 1 ? data.f1_score * 100 : data.f1_score)).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Precision</p>
                <p className="text-lg font-bold text-blue-500">
                  {data.precision !== null && data.precision !== undefined
                    ? `${((data.precision < 1 ? data.precision * 100 : data.precision)).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Recall</p>
                <p className="text-lg font-bold text-cyan-500">
                  {data.recall !== null && data.recall !== undefined
                    ? `${((data.recall < 1 ? data.recall * 100 : data.recall)).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Mini confusion matrix */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Confusion Matrix
              </p>
              <div className="grid grid-cols-2 gap-1 text-center text-xs">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-700 dark:text-emerald-300">
                  TP: {data.confusion_matrix?.tp ?? 'N/A'}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300">
                  FP: {data.confusion_matrix?.fp ?? 'N/A'}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300">
                  FN: {data.confusion_matrix?.fn ?? 'N/A'}
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-700 dark:text-emerald-300">
                  TN: {data.confusion_matrix?.tn ?? 'N/A'}
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

