const Subscription = require('../models/Subscription')
const SubscriptionRating = require('../models/SubscriptionRating')

async function initDb() {
  await Subscription.createTable()
  await SubscriptionRating.createTable()
  console.log('All tables initialized.')
}

module.exports = initDb
