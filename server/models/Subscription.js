const pool = require('../config/db')

const Subscription = {
  async createTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id            SERIAL PRIMARY KEY,
        user_id       UUID NOT NULL,
        name          VARCHAR(100) NOT NULL,
        cost          NUMERIC(10, 2) NOT NULL CHECK (cost > 0),
        currency      CHAR(3) NOT NULL DEFAULT 'USD',
        billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
        start_date    DATE NOT NULL,
        is_active     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
  },

  async create({ user_id, name, cost, currency, billing_cycle, start_date }) {
    const { rows } = await pool.query(
      `INSERT INTO subscriptions (user_id, name, cost, currency, billing_cycle, start_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, name, cost, currency, billing_cycle, start_date]
    )
    return rows[0]
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM subscriptions WHERE id = $1',
      [id]
    )
    return rows[0] || null
  },

  async findByUserId(user_id) {
    const { rows } = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    )
    return rows
  },

  async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM subscriptions WHERE id = $1 RETURNING *',
      [id]
    )
    return rows[0] || null
  },

  async findByUserIdWithLatestRating(user_id) {
    const { rows } = await pool.query(
      `SELECT s.*,
         (SELECT rating FROM subscription_ratings
          WHERE subscription_id = s.id
          ORDER BY created_at DESC LIMIT 1) AS latest_rating
       FROM subscriptions s
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [user_id]
    )
    return rows
  },
}

module.exports = Subscription
