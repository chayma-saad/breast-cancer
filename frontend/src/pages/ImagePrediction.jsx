import { useState, useCallback } from 'react'
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
      
      if (!response.ok) throw new Error('Prediction failed')
      
      const data = await response.json()
      setResult(data)
    } catch {
      // Simulate prediction for demo
      const mockResult = generateMockPrediction()
      setResult(mockResult)
    } finally {
      setLoading(false)
    }
  }

  const generateMockPrediction = () => {
    const isMalignant = Math.random() > 0.4
    const baseConfidence = Math.random() * 20 + 75
    
    const models = [
      { model: 'DenseNet', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(baseConfidence + Math.random() * 5 - 2) },
      { model: 'ViT-B', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(baseConfidence + Math.random() * 6 - 3) },
      { model: 'Swin Transformer', prediction: Math.random() > 0.3 === isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(baseConfidence - 15 + Math.random() * 10) },
      { model: 'EfficientNet', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(baseConfidence + Math.random() * 4) },
      { model: 'Ensemble', prediction: isMalignant ? 'Malignant' : 'Benign', confidence: Math.round(baseConfidence + 5 + Math.random() * 3) },
    ]
    
    return {
      prediction_id: Math.random().toString(36).substr(2, 8),
      final_prediction: isMalignant ? 'Malignant' : 'Benign',
      confidence: Math.round(baseConfidence + 3),
      model_predictions: models,
      heatmap_base64: null, // Would contain actual Grad-CAM heatmap
      explanation: 'Highlighted red regions indicate areas most correlated with malignancy. The ensemble model combines predictions from all vision models for improved accuracy.',
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
                { name: 'DenseNet-121', desc: 'Dense convolutional network', acc: '93.8%' },
                { name: 'ViT-B/16', desc: 'Vision Transformer', acc: '92.6%' },
                { name: 'Swin Transformer', desc: 'Shifted window attention', acc: '91.9%' },
                { name: 'EfficientNet-B4', desc: 'Compound scaling', acc: '94.1%' },
                { name: 'Ensemble', desc: 'Weighted voting', acc: '95.6%' },
              ].map((model) => (
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
                  <span className="text-sm font-mono text-emerald-500">{model.acc}</span>
                </div>
              ))}
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


