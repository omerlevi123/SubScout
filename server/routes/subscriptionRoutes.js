const express = require('express')
const router = express.Router()
const { createSubscription, getAllSubscriptions, addRating, deleteSubscription } = require('../controllers/subscriptionController')

router.post('/', createSubscription)
router.get('/', getAllSubscriptions)
router.post('/:id/rating', addRating)
router.delete('/:id', deleteSubscription)

module.exports = router
