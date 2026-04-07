const express = require('express')
const router = express.Router()
const { createSubscription, getAllSubscriptions, addRating } = require('../controllers/subscriptionController')

router.post('/', createSubscription)
router.get('/', getAllSubscriptions)
router.post('/:id/rating', addRating)

module.exports = router
