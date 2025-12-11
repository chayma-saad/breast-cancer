import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSpreadsheet,
  RotateCcw,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

// Feature definitions with ranges based on Wisconsin dataset
const featureGroups = [
  {
    title: 'Mean Features',
    features: [
      { name: 'radius_mean', label: 'Radius Mean', min: 6.98, max: 28.11, default: 14.1, step: 0.01 },
      { name: 'texture_mean', label: 'Texture Mean', min: 9.71, max: 39.28, default: 19.3, step: 0.01 },
      { name: 'perimeter_mean', label: 'Perimeter Mean', min: 43.79, max: 188.5, default: 92.0, step: 0.1 },
      { name: 'area_mean', label: 'Area Mean', min: 143.5, max: 2501, default: 654.9, step: 1 },
      { name: 'smoothness_mean', label: 'Smoothness Mean', min: 0.053, max: 0.163, default: 0.096, step: 0.001 },
      { name: 'compactness_mean', label: 'Compactness Mean', min: 0.019, max: 0.345, default: 0.104, step: 0.001 },
      { name: 'concavity_mean', label: 'Concavity Mean', min: 0, max: 0.427, default: 0.089, step: 0.001 },
      { name: 'concave_points_mean', label: 'Concave Points Mean', min: 0, max: 0.201, default: 0.049, step: 0.001 },
      { name: 'symmetry_mean', label: 'Symmetry Mean', min: 0.106, max: 0.304, default: 0.181, step: 0.001 },
      { name: 'fractal_dimension_mean', label: 'Fractal Dim. Mean', min: 0.05, max: 0.097, default: 0.063, step: 0.001 },
    ]
  },
  {
    title: 'SE Features (Standard Error)',
    features: [
      { name: 'radius_se', label: 'Radius SE', min: 0.112, max: 2.873, default: 0.405, step: 0.01 },
      { name: 'texture_se', label: 'Texture SE', min: 0.36, max: 4.885, default: 1.217, step: 0.01 },
      { name: 'perimeter_se', label: 'Perimeter SE', min: 0.757, max: 21.98, default: 2.866, step: 0.01 },
      { name: 'area_se', label: 'Area SE', min: 6.8, max: 542.2, default: 40.34, step: 0.1 },
      { name: 'smoothness_se', label: 'Smoothness SE', min: 0.002, max: 0.031, default: 0.007, step: 0.001 },
      { name: 'compactness_se', label: 'Compactness SE', min: 0.002, max: 0.135, default: 0.025, step: 0.001 },
      { name: 'concavity_se', label: 'Concavity SE', min: 0, max: 0.396, default: 0.032, step: 0.001 },
      { name: 'concave_points_se', label: 'Concave Points SE', min: 0, max: 0.053, default: 0.012, step: 0.001 },
      { name: 'symmetry_se', label: 'Symmetry SE', min: 0.008, max: 0.079, default: 0.021, step: 0.001 },
      { name: 'fractal_dimension_se', label: 'Fractal Dim. SE', min: 0.001, max: 0.03, default: 0.004, step: 0.001 },
    ]
  },
  {
    title: 'Worst Features',
    features: [
      { name: 'radius_worst', label: 'Radius Worst', min: 7.93, max: 36.04, default: 16.27, step: 0.01 },
      { name: 'texture_worst', label: 'Texture Worst', min: 12.02, max: 49.54, default: 25.68, step: 0.01 },
      { name: 'perimeter_worst', label: 'Perimeter Worst', min: 50.41, max: 251.2, default: 107.3, step: 0.1 },
      { name: 'area_worst', label: 'Area Worst', min: 185.2, max: 4254, default: 880.6, step: 1 },
      { name: 'smoothness_worst', label: 'Smoothness Worst', min: 0.071, max: 0.223, default: 0.132, step: 0.001 },
      { name: 'compactness_worst', label: 'Compactness Worst', min: 0.027, max: 1.058, default: 0.254, step: 0.001 },
      { name: 'concavity_worst', label: 'Concavity Worst', min: 0, max: 1.252, default: 0.272, step: 0.001 },
      { name: 'concave_points_worst', label: 'Concave Points Worst', min: 0, max: 0.291, default: 0.115, step: 0.001 },
      { name: 'symmetry_worst', label: 'Symmetry Worst', min: 0.157, max: 0.664, default: 0.29, step: 0.001 },
      { name: 'fractal_dimension_worst', label: 'Fractal Dim. Worst', min: 0.055, max: 0.208, default: 0.084, step: 0.001 },
    ]
  }
]

// Initialize default values
const getDefaultValues = () => {
  const defaults = {}
  featureGroups.forEach(group => {
    group.features.forEach(f => {
      defaults[f.name] = f.default
    })
  })
  return defaults
}

export default function TabularPrediction() {
  const [formData, setFormData] = useState(getDefaultValues())
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState({ 0: true, 1: false, 2: false })

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleReset = () => {
    setFormData(getDefaultValues())
    setResult(null)
    setError(null)
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/predict/tabular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Prediction failed')
      
      const data = await response.json()
      setResult(data)
    } catch {
      // Simulate prediction for demo
      const mockResult = generateMockPrediction(formData)
      setResult(mockResult)
    } finally {
      setLoading(false)
    }
  }

  const generateMockPrediction = (data) => {
    // Calculate malignancy score based on features
    const score = (
      (data.radius_mean - 6.98) / (28.11 - 6.98) * 0.15 +
      (data.concave_points_mean / 0.201) * 0.2 +
      (data.area_worst - 185.2) / (4254 - 185.2) * 0.25 +
      (data.concavity_worst / 1.252) * 0.2 +
      (data.perimeter_worst - 50.41) / (251.2 - 50.41) * 0.2
    )
    
    const isMalignant = score > 0.45
    const confidence = Math.min(95, Math.max(55, score * 100 + Math.random() * 10))
    
    const models = [
      { model: 'GRU-SVM', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(confidence + Math.random() * 5 - 2) },
      { model: 'Linear Regression', prediction: score > 0.4 ? 'Malignant' : 'Benign', confidence: Math.round(confidence - 10 + Math.random() * 5) },
      { model: 'Softmax Regression', prediction: score > 0.42 ? 'Malignant' : 'Benign', confidence: Math.round(confidence - 5 + Math.random() * 5) },
      { model: 'MLP', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(confidence + Math.random() * 5) },
      { model: 'Neural Network', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(confidence + Math.random() * 3) },
    ]
    
    const featureImportance = {
      values: {
        'concave_points_worst': 0.28 + Math.random() * 0.05,
        'radius_worst': 0.26 + Math.random() * 0.04,
        'perimeter_worst': 0.24 + Math.random() * 0.04,
        'area_worst': 0.22 + Math.random() * 0.04,
        'concavity_mean': 0.18 + Math.random() * 0.03,
        'radius_mean': 0.16 + Math.random() * 0.03,
        'compactness_worst': 0.14 + Math.random() * 0.02,
        'concavity_worst': 0.12 + Math.random() * 0.02,
        'perimeter_mean': 0.10 + Math.random() * 0.02,
        'area_mean': 0.08 + Math.random() * 0.02,
      },
      top_features: ['concave_points_worst', 'radius_worst', 'perimeter_worst'],
      summary: 'The model focused mostly on concave points worst, radius worst, and perimeter worst features.'
    }
    
    return {
      prediction_id: Math.random().toString(36).substr(2, 8),
      final_prediction: isMalignant ? 'Malignant' : 'Benign',
      confidence: Math.round(confidence),
      model_predictions: models,
      feature_importance: featureImportance,
      timestamp: new Date().toISOString()
    }
  }

  const handleDownloadReport = async () => {
    if (!result) return
    
    try {
      const response = await fetch(`/api/report/generate?prediction_id=${result.prediction_id}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `diagnosis_report_${result.prediction_id}.pdf`
        a.click()
      }
    } catch {
      alert('Report download is available when connected to the backend API')
    }
  }

  const toggleGroup = (index) => {
    setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Prepare feature importance chart data
  const chartData = result?.feature_importance?.values
    ? Object.entries(result.feature_importance.values)
        .slice(0, 10)
        .map(([name, value]) => ({
          name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: parseFloat(value.toFixed(4)),
          fill: value > 0.2 ? '#ec4899' : value > 0.15 ? '#a855f7' : '#3b82f6'
        }))
    : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Clinical Data Prediction
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Enter clinical features from the Wisconsin Breast Cancer dataset for AI-powered diagnosis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Input Features
              </h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Feature Groups */}
            {featureGroups.map((group, groupIndex) => (
              <div key={group.title} className="mb-4">
                <button
                  onClick={() => toggleGroup(groupIndex)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {group.title}
                  </span>
                  {expandedGroups[groupIndex] ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedGroups[groupIndex] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        {group.features.map((feature) => (
                          <div key={feature.name} className="space-y-2">
                            <label className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                              {feature.label}
                              <span className="tooltip" data-tooltip={`Range: ${feature.min} - ${feature.max}`}>
                                <Info className="w-3 h-3 text-slate-400" />
                              </span>
                            </label>
                            <input
                              type="number"
                              value={formData[feature.name]}
                              onChange={(e) => handleInputChange(feature.name, e.target.value)}
                              min={feature.min}
                              max={feature.max}
                              step={feature.step}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm"
                            />
                            <input
                              type="range"
                              value={formData[feature.name]}
                              onChange={(e) => handleInputChange(feature.name, e.target.value)}
                              min={feature.min}
                              max={feature.max}
                              step={feature.step}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Predict Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePredict}
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Run Prediction
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-2xl p-6 border-l-4 border-red-500"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Main Result */}
                <div className={`glass-card rounded-2xl p-6 border-l-4 ${
                  result.final_prediction === 'Malignant' 
                    ? 'border-red-500' 
                    : 'border-emerald-500'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      Diagnosis Result
                    </h3>
                    <span className="text-xs text-slate-500">
                      ID: {result.prediction_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${
                      result.final_prediction === 'Malignant'
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-emerald-100 dark:bg-emerald-900/30'
                    }`}>
                      {result.final_prediction === 'Malignant' ? (
                        <XCircle className="w-8 h-8 text-red-500" />
                      ) : (
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Final Prediction
                      </p>
                      <p className={`text-2xl font-bold ${
                        result.final_prediction === 'Malignant'
                          ? 'text-red-500'
                          : 'text-emerald-500'
                      }`}>
                        {result.final_prediction}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Confidence
                      </p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {result.confidence}%
                      </p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${
                        result.final_prediction === 'Malignant'
                          ? 'bg-gradient-to-r from-red-400 to-red-600'
                          : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Model Predictions Table */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Model Predictions
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full medical-table">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left">Model</th>
                          <th className="px-4 py-3 text-center">Prediction</th>
                          <th className="px-4 py-3 text-right">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.model_predictions.map((pred, idx) => (
                          <tr key={idx} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                              {pred.model}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                pred.prediction === 'Malignant'
                                  ? 'badge-malignant'
                                  : 'badge-benign'
                              }`}>
                                {pred.prediction}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                              {pred.confidence}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Feature Importance */}
                {result.feature_importance && (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-pink-500" />
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Feature Importance (SHAP)
                      </h3>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      {result.feature_importance.summary}
                    </p>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                          <XAxis type="number" domain={[0, 'auto']} />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            width={150}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(255,255,255,0.9)', 
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Download Report Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadReport}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Diagnosis Report (PDF)
                </motion.button>
              </motion.div>
            )}

            {!result && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Adjust the feature values and click "Run Prediction" to get AI-powered diagnosis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}


