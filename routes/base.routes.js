const express = require('express')
const router = express.Router()

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Login to continue'})


// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/private', checkLoggedIn, (req, res, next) => {
    res.render('auth/private', { user: req.user})
})

module.exports = router
