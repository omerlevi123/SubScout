import { useState } from 'react'
import { motion } from 'framer-motion'
import { createSubscription } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AddSubModal({ onClose, onAdded }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    cost: '',
    currency: 'USD',
    billing_cycle: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createSubscription({ ...form, user_id: user.id })
      onAdded()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">New Subscription</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Netflix, Spotify, GitHub…"
              className="mt-1.5 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.cost}
                onChange={(e) => set('cost', e.target.value)}
                placeholder="9.99"
                className="mt-1.5 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
                className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Billing Cycle</label>
            <div className="mt-1.5 flex gap-2">
              {['monthly', 'yearly', 'weekly'].map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => set('billing_cycle', cycle)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                    form.billing_cycle === cycle
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</label>
            <input
              required
              type="date"
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
              className="mt-1.5 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Adding…' : 'Add Subscription'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
