const express = require('express')
const router = express.Router()


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Not authorized, please log in' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/private-page', ensureAuthenticated, (req, res) => res.render('auth/private', { user: req.user }))

module.exports = router
