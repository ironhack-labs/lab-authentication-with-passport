const express = require('express')
const router = express.Router()

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {
    message: 'Desautorizado, incia sesión para continuar'
})

// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/private-page', checkLoggedIn, (req, res, next) => res.render('auth/private-page', req.user))

module.exports = router