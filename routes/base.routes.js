const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))

const isLoged = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {errorMsg: 'Please log in to access this page'})

router.get('/private', isLoged, (req, res) => res.render('auth/private', { user: req.user }))


module.exports = router
