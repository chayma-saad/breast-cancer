import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const glossaryTerms = [
  {
    category: 'Medical Terms',
    terms: [
      {
        term: 'Benign',
        definition: 'A non-cancerous growth that does not spread to other parts of the body. Benign tumors are generally not life-threatening and can often be removed.',
        related: ['Malignant', 'Tumor']
      },
      {
        term: 'Malignant',
        definition: 'A cancerous growth that can invade nearby tissues and spread to other parts of the body through the blood and lymph systems. Malignant tumors require prompt treatment.',
        related: ['Benign', 'Metastasis']
      },
      {
        term: 'Mammogram',
        definition: 'An X-ray image of the breast used to detect and diagnose breast diseases, including cancer. Regular mammograms are recommended for breast cancer screening.',
        related: ['Screening', 'Breast Cancer']
      },
      {
        term: 'Biopsy',
        definition: 'A medical procedure that involves taking a small sample of tissue for examination under a microscope to determine if cancer or other abnormal cells are present.',
        related: ['Diagnosis', 'Pathology']
      },
      {
        term: 'Metastasis',
        definition: 'The spread of cancer cells from the primary site to other parts of the body. Cancer cells can travel through the bloodstream or lymphatic system.',
        related: ['Malignant', 'Stage']
      },
      {
        term: 'Tumor',
        definition: 'An abnormal mass of tissue that forms when cells divide more than they should or do not die when they should. Tumors can be benign or malignant.',
        related: ['Benign', 'Malignant']
      }
    ]
  },
  {
    category: 'Dataset Features',
    terms: [
      {
        term: 'Radius',
        definition: 'The mean distance from the center to points on the perimeter of the cell nucleus. Larger radius values may indicate abnormal cell growth.',
        related: ['Perimeter', 'Area']
      },
      {
        term: 'Texture',
        definition: 'The standard deviation of gray-scale values in the cell image. Indicates the variation in cell surface texture.',
        related: ['Smoothness']
      },
      {
        term: 'Perimeter',
        definition: 'The total length of the cell nucleus boundary. Related to the size and shape of the cell.',
        related: ['Radius', 'Area']
      },
      {
        term: 'Area',
        definition: 'The total area enclosed by the cell nucleus perimeter. Abnormally large areas may suggest cancerous cells.',
        related: ['Radius', 'Perimeter']
      },
      {
        term: 'Smoothness',
        definition: 'Local variation in radius lengths. Measures how uniform the cell boundary is.',
        related: ['Texture', 'Compactness']
      },
      {
        term: 'Compactness',
        definition: 'Calculated as (perimeter² / area - 1.0). Measures how compact or spread out the cell is.',
        related: ['Smoothness', 'Concavity']
      },
      {
        term: 'Concavity',
        definition: 'The severity of concave portions of the cell contour. Higher values indicate more irregular cell shapes.',
        related: ['Concave Points', 'Compactness']
      },
      {
        term: 'Concave Points',
        definition: 'The number of concave portions of the cell contour. More concave points suggest irregular cell boundaries.',
        related: ['Concavity']
      },
      {
        term: 'Symmetry',
        definition: 'Measures how symmetric the cell is. Cancerous cells often show asymmetric features.',
        related: ['Fractal Dimension']
      },
      {
        term: 'Fractal Dimension',
        definition: 'A measure of the complexity of the cell boundary using the "coastline approximation" - higher values indicate more complex, irregular boundaries.',
        related: ['Symmetry', 'Concavity']
      }
    ]
  },
  {
    category: 'Machine Learning Terms',
    terms: [
      {
        term: 'Accuracy',
        definition: 'The proportion of correct predictions (both true positives and true negatives) among the total number of cases examined.',
        related: ['Precision', 'Recall', 'F1 Score']
      },
      {
        term: 'Precision',
        definition: 'The proportion of true positive predictions among all positive predictions. High precision means fewer false positives.',
        related: ['Recall', 'F1 Score']
      },
      {
        term: 'Recall (Sensitivity)',
        definition: 'The proportion of actual positive cases that were correctly identified. High recall means fewer false negatives.',
        related: ['Precision', 'Specificity']
      },
      {
        term: 'F1 Score',
        definition: 'The harmonic mean of precision and recall. Provides a balanced measure of model performance, especially useful for imbalanced datasets.',
        related: ['Precision', 'Recall']
      },
      {
        term: 'ROC Curve',
        definition: 'Receiver Operating Characteristic curve plots the true positive rate against the false positive rate at various threshold settings.',
        related: ['AUC', 'Sensitivity', 'Specificity']
      },
      {
        term: 'AUC (Area Under Curve)',
        definition: 'The area under the ROC curve. Values closer to 1.0 indicate better model performance. A random classifier has an AUC of 0.5.',
        related: ['ROC Curve']
      },
      {
        term: 'Confusion Matrix',
        definition: 'A table showing true positives, true negatives, false positives, and false negatives. Helps visualize model performance.',
        related: ['Accuracy', 'Precision', 'Recall']
      },
      {
        term: 'SHAP Values',
        definition: 'SHapley Additive exPlanations - a method to explain the output of machine learning models by attributing importance to each feature.',
        related: ['Feature Importance', 'Explainability']
      }
    ]
  },
  {
    category: 'Deep Learning Models',
    terms: [
      {
        term: 'DenseNet',
        definition: 'Dense Convolutional Network - a CNN architecture where each layer receives feature maps from all preceding layers, improving gradient flow and feature reuse.',
        related: ['CNN', 'ResNet']
      },
      {
        term: 'Vision Transformer (ViT)',
        definition: 'A transformer architecture applied directly to sequences of image patches. Achieves excellent results on image classification tasks.',
        related: ['Transformer', 'Attention']
      },
      {
        term: 'Swin Transformer',
        definition: 'A hierarchical Vision Transformer using shifted windows for computing self-attention. More efficient than standard ViT for high-resolution images.',
        related: ['ViT', 'Attention']
      },
      {
        term: 'EfficientNet',
        definition: 'A CNN architecture that uses compound scaling to uniformly scale network depth, width, and resolution for optimal efficiency.',
        related: ['CNN', 'Scaling']
      },
      {
        term: 'Ensemble Learning',
        definition: 'A technique that combines predictions from multiple models to achieve better predictive performance than any single model.',
        related: ['Voting', 'Bagging', 'Boosting']
      },
      {
        term: 'Grad-CAM',
        definition: 'Gradient-weighted Class Activation Mapping - a technique to produce visual explanations for CNN decisions by highlighting important regions.',
        related: ['Explainability', 'CNN']
      },
      {
        term: 'Transfer Learning',
        definition: 'Using a pre-trained model as a starting point for a new task. Especially useful when you have limited training data.',
        related: ['Pre-training', 'Fine-tuning']
      },
      {
        term: 'GRU (Gated Recurrent Unit)',
        definition: 'A type of recurrent neural network that can learn long-term dependencies in sequential data using gating mechanisms.',
        related: ['LSTM', 'RNN']
      }
    ]
  }
]

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({
    'Medical Terms': true,
    'Dataset Features': false,
    'Machine Learning Terms': false,
    'Deep Learning Models': false
  })

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filteredTerms = glossaryTerms.map(category => ({
    ...category,
    terms: category.terms.filter(term =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.terms.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
            <Book className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Medical Glossary
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Understanding the terminology used in breast cancer diagnosis and machine learning
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-pink-500 hover:text-pink-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Terms by Category */}
      <div className="space-y-4">
        {filteredTerms.map((category, categoryIdx) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIdx * 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  category.category === 'Medical Terms' ? 'bg-pink-500' :
                  category.category === 'Dataset Features' ? 'bg-purple-500' :
                  category.category === 'Machine Learning Terms' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`} />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {category.category}
                </h2>
                <span className="text-sm text-slate-500">
                  ({category.terms.length} terms)
                </span>
              </div>
              {expandedCategories[category.category] ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Terms List */}
            {expandedCategories[category.category] && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {category.terms.map((item, idx) => (
                  <motion.div
                    key={item.term}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-6 ${
                      idx !== category.terms.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                      {item.term}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {item.definition}
                    </p>
                    {item.related && item.related.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">Related:</span>
                        {item.related.map((rel) => (
                          <button
                            key={rel}
                            onClick={() => setSearchTerm(rel)}
                            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                            {rel}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {filteredTerms.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            No terms found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search query
          </p>
        </div>
      )}

      {/* Resources */}
      <div className="mt-8 glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Additional Resources
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'American Cancer Society', url: 'https://www.cancer.org' },
            { name: 'National Cancer Institute', url: 'https://www.cancer.gov' },
            { name: 'Wisconsin Breast Cancer Dataset', url: 'https://archive.ics.uci.edu/ml/datasets/breast+cancer+wisconsin' },
            { name: 'Susan G. Komen Foundation', url: 'https://www.komen.org' }
          ].map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
            >
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {resource.name}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


