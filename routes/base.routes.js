const express = require('express')
const User = require('../models/user.model')
const router = express.Router()

const ensureAuth = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {
    errorMsg: 'Unathorized, please Log in'
})




// Endpoints
router.get('/', (req, res) => res.render('index'))

// Private
router.get('/private', ensureAuth, (req, res) => res.render('auth/private', {
    user: req.user
}))

module.exports = router