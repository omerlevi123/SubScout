const Subscription = require('../models/Subscription')
const SubscriptionRating = require('../models/SubscriptionRating')

async function createSubscription(req, res) {
  try {
    const { user_id, name, cost, currency, billing_cycle, start_date } = req.body
    const subscription = await Subscription.create({ user_id, name, cost, currency, billing_cycle, start_date })
    res.status(201).json(subscription)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getAllSubscriptions(req, res) {
  try {
    const { user_id } = req.query
    const subscriptions = await Subscription.findByUserIdWithLatestRating(user_id)
    res.json(subscriptions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function addRating(req, res) {
  try {
    const { id } = req.params
    const { rating } = req.body
    const result = await SubscriptionRating.addRating(id, rating)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createSubscription, getAllSubscriptions, addRating }
