const express = require('express')
const router = express.Router()

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('login-form', {
    message: 'You must log in to continue'
})


// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile',checkLoggedIn, (req, res, next) => res.render('profile', req.user))


module.exports = router
