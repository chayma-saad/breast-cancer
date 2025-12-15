import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Shield, AlertTriangle } from 'lucide-react'

const ROLES = [
  { value: 'patient', label: 'Patient' },
  { value: 'clinician', label: 'Clinician' },
  { value: 'judge', label: 'Healthcare Leader' }
]

export default function ClinicalCompanion() {
  const [userRole, setUserRole] = useState('patient')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conversation, setConversation] = useState([])

  // Default context; in the future this can be wired to the last prediction/trust report
  const defaultContext = {
    prediction: 'benign',
    avg_confidence: 0.85,
    trust_score: 0.8,
    model_agreement: '3/3',
    explainability_score: 0.8,
    uncertainty_reasons: []
  }

  const handleSend = async () => {
    if (!message.trim() || loading) return
    setLoading(true)
    setError(null)

    const userBubble = { from: 'user', text: message }
    setConversation(prev => [...prev, userBubble])

    try {
      const body = {
        user_message: message,
        user_role: userRole,
        ...defaultContext
      }

      const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const aiText = data.reply || 'Sorry, I could not generate a response.'
      setConversation(prev => [...prev, { from: 'ai', text: aiText }])
      setMessage('')
    } catch (e) {
      console.error(e)
      setError('Chat service is unavailable right now. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Clinical AI Companion
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Ask questions about your AI results in safe, explainable language. This tool does not provide diagnoses and should not replace a medical professional.
        </p>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        {/* Chat panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[460px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Role-aware conversation
              </span>
            </div>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
            {conversation.length === 0 && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Start by describing your question, for example:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>“What does a benign prediction with 85% confidence mean for me?”</li>
                  <li>“How should a clinician interpret a low trust score?”</li>
                </ul>
              </div>
            )}
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.from === 'user'
                    ? 'ml-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'mr-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {error}
            </div>
          )}

          <div className="flex items-end gap-3">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here (press Enter to send, Shift+Enter for new line)…"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/60"
            />
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety & context card */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
              Safety Guardrails
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Does not provide diagnoses or treatment decisions.</li>
              <li>• Explains uncertainty and model limitations in plain language.</li>
              <li>• Encourages consultation with a qualified clinician.</li>
              <li>• Adapts explanations to your selected role.</li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
              Current AI Context (example)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Prediction: <span className="font-semibold capitalize">{defaultContext.prediction}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Average confidence: <span className="font-semibold">{(defaultContext.avg_confidence * 100).toFixed(1)}%</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Trust score: <span className="font-semibold">{(defaultContext.trust_score * 100).toFixed(0)}%</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Model agreement: <span className="font-semibold">{defaultContext.model_agreement}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


