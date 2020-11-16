const express = require('express')
const router = express.Router()
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You are not authorized' })


// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/private', ensureAuthenticated, (req, res) => res.render('auth/private', { user: req.user }))

module.exports = router
