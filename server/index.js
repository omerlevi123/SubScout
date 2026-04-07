require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const initDb = require('./database/init')
const subscriptionRoutes = require('./routes/subscriptionRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/subscriptions', subscriptionRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Sub Scout API is running.' })
})

app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ connected: true, time: result.rows[0].now })
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message })
  }
})

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
