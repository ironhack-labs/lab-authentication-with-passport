const express = require('express')
const router = express.Router()

const checkLoggedin = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Unauthorized, login to continue'})

// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/private', checkLoggedin, (req, res, next) => {
    res.render('auth/private', { user: req.user })
})

module.exports = router
