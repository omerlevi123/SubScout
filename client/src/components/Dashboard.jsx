import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscriptions, deleteSubscription } from "../services/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import StatCard from "./StatCard";
import SubscriptionCard from "./SubscriptionCard";
import RateModal from "./RateModal";
import AddSubModal from "./AddSubModal";

const toMonthly = (sub) => {
  const cost = parseFloat(sub.cost);
  if (sub.billing_cycle === "weekly") return cost * 4.33;
  if (sub.billing_cycle === "yearly") return cost / 12;
  return cost;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);

  const handleDelete = async (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteSubscription(id);
    } catch (err) {
      console.error(err);
      fetchSubscriptions();
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data } = await getSubscriptions(user.id);
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Stats — memoized so they only recompute when subscriptions changes
  const totalSpend = useMemo(
    () => subscriptions.reduce((sum, s) => sum + toMonthly(s), 0),
    [subscriptions],
  );

  const { rated, avgRating } = useMemo(() => {
    const rated = subscriptions.filter((s) => s.latest_rating !== null);
    const avgRating =
      rated.length > 0
        ? (
            rated.reduce((sum, s) => sum + Number(s.latest_rating), 0) /
            rated.length
          ).toFixed(1)
        : null;
    return { rated, avgRating };
  }, [subscriptions]);

  const mostValuable = useMemo(
    () =>
      subscriptions.reduce((best, s) => {
        if (s.latest_rating === null) return best;
        const score = Number(s.latest_rating) / toMonthly(s);
        if (!best || score > best.score) return { ...s, score };
        return best;
      }, null),
    [subscriptions],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Sub Scout"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-slate-900">Sub Scout</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              + Add Subscription
            </button>
            <button
              onClick={signOut}
              className="text-slate-500 hover:text-slate-700 text-sm px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Monthly Spend"
            value={`$${totalSpend.toFixed(2)}`}
            icon="💸"
            color="indigo"
          />
          <StatCard
            label="Average Rating"
            value={avgRating ? `${avgRating} / 10` : "—"}
            sub={
              avgRating
                ? `across ${rated.length} rated sub${rated.length !== 1 ? "s" : ""}`
                : "Rate your subscriptions"
            }
            icon="⭐"
            color="violet"
          />
          <StatCard
            label="Most Valuable"
            value={mostValuable ? mostValuable.name : "—"}
            sub={
              mostValuable
                ? `${mostValuable.latest_rating}/10 · $${toMonthly(mostValuable).toFixed(2)}/mo`
                : "Rate your subs first"
            }
            icon="🏆"
            color="emerald"
          />
        </div>

        {/* Subscription List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Your Subscriptions
            </h2>
            {subscriptions.length > 0 && (
              <span className="text-xs text-slate-400">
                {subscriptions.length} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-5 h-40 animate-pulse"
                />
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="font-semibold text-slate-500">
                No subscriptions yet
              </p>
              <p className="text-sm mt-1.5">
                Click "Add Subscription" to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {subscriptions.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <SubscriptionCard
                      subscription={sub}
                      onRate={() => setRatingTarget(sub)}
                      onDelete={() => handleDelete(sub.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddSubModal
            key="add"
            onClose={() => setShowAddModal(false)}
            onAdded={fetchSubscriptions}
          />
        )}
        {ratingTarget && (
          <RateModal
            key="rate"
            subscription={ratingTarget}
            onClose={() => setRatingTarget(null)}
            onRated={fetchSubscriptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
