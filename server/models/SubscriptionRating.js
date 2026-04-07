const pool = require('../config/db')

const SubscriptionRating = {
  async createTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscription_ratings (
        id              SERIAL PRIMARY KEY,
        subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
        rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
  },

  async addRating(subscription_id, rating) {
    const { rows } = await pool.query(
      `INSERT INTO subscription_ratings (subscription_id, rating)
       VALUES ($1, $2) RETURNING *`,
      [subscription_id, rating]
    )
    return rows[0]
  },

  async getLatestBySubscriptionId(subscription_id) {
    const { rows } = await pool.query(
      `SELECT * FROM subscription_ratings
       WHERE subscription_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [subscription_id]
    )
    return rows[0] || null
  },
}

module.exports = SubscriptionRating
