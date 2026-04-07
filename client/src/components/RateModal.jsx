import { useState } from 'react'
import { motion } from 'framer-motion'
import { addRating } from '../services/api'

export default function RateModal({ subscription, onClose, onRated }) {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await addRating(subscription.id, selected)
      onRated()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const ratingLabel = (n) => {
    if (n <= 3) return 'Not worth it'
    if (n <= 6) return 'It\'s okay'
    if (n <= 8) return 'Good value'
    return 'Essential!'
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-900 mb-1">Rate this month</h2>
        <p className="text-sm text-slate-500 mb-5">
          How valuable was{' '}
          <span className="font-semibold text-slate-700">{subscription.name}</span>{' '}
          this month?
        </p>

        <div className="grid grid-cols-5 gap-2 mb-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                selected === n
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="h-5 mb-4 text-center">
          {selected && (
            <p className="text-xs font-medium text-indigo-600">{ratingLabel(selected)}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving…' : 'Save Rating'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
