const cycleLabel = { monthly: '/mo', yearly: '/yr', weekly: '/wk' }

const toMonthly = (sub) => {
  const cost = parseFloat(sub.cost)
  if (sub.billing_cycle === 'weekly') return cost * 4.33
  if (sub.billing_cycle === 'yearly') return cost / 12
  return cost
}

const getValueScore = (rating, monthlyCost) => {
  const ratio = rating / monthlyCost
  if (ratio > 0.5) return { label: 'High Value', bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', pct: Math.min(ratio / 1.0, 1) * 100 }
  if (ratio < 0.1) return { label: 'Low Value',  bar: 'bg-red-400',    badge: 'bg-red-50 text-red-600',       pct: Math.min(ratio / 0.1, 1) * 15 }
  // 0.1 – 0.5: fair value, map linearly to 15–100%
  const pct = 15 + ((ratio - 0.1) / (0.5 - 0.1)) * 85
  return { label: 'Fair Value', bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700', pct }
}

export default function SubscriptionCard({ subscription: sub, onRate }) {
  const rating = sub.latest_rating
  const monthlyCost = toMonthly(sub)
  const valueScore = rating !== null ? getValueScore(Number(rating), monthlyCost) : null

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow h-full overflow-hidden">
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">{sub.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">{sub.billing_cycle}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {valueScore && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${valueScore.badge}`}>
                {valueScore.label}
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sub.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {sub.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Cost */}
        <div>
          <span className="text-2xl font-bold text-slate-900">
            {sub.currency} {parseFloat(sub.cost).toFixed(2)}
          </span>
          <span className="text-slate-400 text-sm">{cycleLabel[sub.billing_cycle]}</span>
          {sub.billing_cycle !== 'monthly' && (
            <span className="text-xs text-slate-400 ml-2">
              (${monthlyCost.toFixed(2)}/mo)
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {rating !== null ? (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < rating ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-600 ml-1">{rating}/10</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">Not rated yet</span>
            )}
          </div>
          <button
            onClick={onRate}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            Rate
          </button>
        </div>
      </div>

      {/* Waste Meter */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Value Score</span>
          {valueScore && (
            <span className="text-xs font-medium text-slate-500">
              {(Number(rating) / monthlyCost).toFixed(2)}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          {valueScore ? (
            <div
              className={`h-full rounded-full transition-all duration-500 ${valueScore.bar}`}
              style={{ width: `${valueScore.pct}%` }}
            />
          ) : (
            <div className="h-full w-0" />
          )}
        </div>
      </div>
    </div>
  )
}
