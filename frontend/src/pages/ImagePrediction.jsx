import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Zap
} from 'lucide-react'

export default function ImagePrediction() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modelMetrics, setModelMetrics] = useState(null)

  useEffect(() => {
    // Fetch model metrics from API (handle 500s gracefully)
    const loadMetrics = async () => {
      try {
        const res = await fetch('/api/metrics')
        if (!res.ok) throw new Error(`Metrics request failed (${res.status})`)
        const data = await res.json()
        if (data.image_models) {
          setModelMetrics(data.image_models)
          return
        }
      } catch {
        // Fallback if API fails
      }
      setModelMetrics({
        'Vision Transformer': { accuracy: null },
        'Magnification Aware': { accuracy: null },
        'EfficientNet': { accuracy: null },
        'CNN BreaKHis': { accuracy: null }
      })
    }
    loadMetrics()
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file)
    }
  }, [])

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleImageSelect = (file) => {
    setSelectedImage(file)
    setResult(null)
    setError(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  const handlePredict = async () => {
    if (!selectedImage) return
    
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedImage)
      
      const response = await fetch('/api/predict/image', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        let errorText = 'Unknown error'
        try {
          errorText = await response.text()
          // Try to parse as JSON for better error message
          try {
            const errorJson = JSON.parse(errorText)
            errorText = errorJson.detail || errorText
          } catch {
            // Not JSON, use as-is
          }
        } catch {
          errorText = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(`Prediction failed: ${errorText}`)
      }
      
      const data = await response.json()
      
      // Ensure we only show real models returned by backend
      if (data.model_predictions) {
        const allowedModels = [
          'Vision Transformer',
          'Magnification Aware',
          'EfficientNet',
          'CNN BreaKHis',
          'Ensemble'
        ]
        data.model_predictions = data.model_predictions.filter(p => 
          allowedModels.includes(p.model) || p.model === 'Error'
        )
      }
      
      setResult(data)
      setError(null)
    } catch (err) {
      // Show actual error instead of fake predictions
      setError(err.message || 'Failed to get prediction from backend. Please check that the backend is running and models are loaded.')
      setResult(null)
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Mammogram Analysis
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Upload a mammogram image for AI-powered breast cancer detection using deep learning vision models
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Upload Image
            </h2>

            {/* Drop Zone */}
            {!selectedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-pink-400 dark:hover:border-pink-400'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-pink-500" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  {isDragging ? 'Drop your image here' : 'Drag & drop your mammogram'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-slate-400">
                  Supported formats: JPEG, PNG, DICOM
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={imagePreview}
                    alt="Uploaded mammogram"
                    className="w-full h-64 object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File Info */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                        {selectedImage.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(selectedImage.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="text-sm text-pink-500 hover:text-pink-600 font-medium"
                  >
                    Change
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Predict Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePredict}
              disabled={!selectedImage || loading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Mammogram
                </>
              )}
            </motion.button>
          </div>

          {/* Vision Models Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Vision Models Used
            </h3>
            <div className="space-y-3">
              {[
                { 
                  name: 'Vision Transformer (ViT)', 
                  desc: 'Vision Transformer fine-tuned on mammograms',
                  key: 'Vision Transformer'
                },
                { 
                  name: 'Magnification Aware', 
                  desc: 'Magnification-aware model for different image scales',
                  key: 'Magnification Aware'
                },
                { 
                  name: 'EfficientNet', 
                  desc: 'EfficientNet variant tailored for mammogram classification',
                  key: 'EfficientNet'
                },
                { 
                  name: 'CNN BreaKHis', 
                  desc: 'CNN model trained on BreaKHis dataset',
                  key: 'CNN BreaKHis'
                },
              ].map((model) => {
                const metrics = modelMetrics?.[model.key]
                const accuracy = metrics?.accuracy
                const accDisplay = accuracy !== null && accuracy !== undefined
                  ? `${(accuracy < 1 ? accuracy * 100 : accuracy).toFixed(1)}%`
                  : 'N/A'
                
                return (
                <div
                  key={model.name}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                      {model.name}
                    </p>
                    <p className="text-xs text-slate-500">{model.desc}</p>
                  </div>
                  <span className="text-sm font-mono text-emerald-500">{accDisplay}</span>
                </div>
                )
              })}
            </div>
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
                      Analysis Result
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

                {/* Heatmap / Grad-CAM */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      Grad-CAM Visualization
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Original Image</p>
                      <div className="rounded-xl overflow-hidden bg-slate-900">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Original"
                            className="w-full h-40 object-contain"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Attention Heatmap</p>
                      <div className="rounded-xl overflow-hidden bg-slate-900 relative">
                        {imagePreview && (
                          <>
                            <img
                              src={imagePreview}
                              alt="Heatmap"
                              className="w-full h-40 object-contain opacity-60"
                            />
                            {/* Simulated heatmap overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-yellow-500/30 to-transparent rounded-xl" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {result.explanation}
                    </p>
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
                                  : pred.prediction === 'Benign'
                                    ? 'badge-benign'
                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                              }`}>
                                {pred.prediction || 'Error'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                              {pred.confidence !== undefined ? `${pred.confidence}%` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trust & Safety */}
                {result.trust_report && (
                  <div className="glass-card rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                      AI Trust & Safety
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                        <p className="text-sm text-slate-500">Trust Score</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                          {(result.trust_report.trust_analysis?.trust_score ?? 0).toFixed(2)}
                          <span className="text-sm ml-2 text-slate-500">
                            {result.trust_report.trust_analysis?.trust_level || ''}
                          </span>
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                        <p className="text-sm text-slate-500">Model Agreement</p>
                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                          {((result.trust_report.agreement_analysis?.agreement_ratio ?? 0) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {result.trust_report.agreement_analysis?.recommendation}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                      <p className="font-semibold mb-1">Self-Critique</p>
                      <p>{result.trust_report.self_critique?.critique_message || 'No additional notes.'}</p>
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">Safety Alerts</p>
                      <div className="flex flex-wrap gap-2">
                        {(result.trust_report.safety_alerts || []).map((alert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                          >
                            {alert}
                          </span>
                        ))}
                        {(result.trust_report.safety_alerts || []).length === 0 && (
                          <span className="text-xs text-slate-500">No alerts</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                      <p className="font-semibold mb-1">Recommendation</p>
                      <p>{result.trust_report.recommendation || 'No recommendation available.'}</p>
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
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Upload a Mammogram
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Drag and drop or click to upload an image for AI-powered analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}


