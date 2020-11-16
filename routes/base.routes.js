const express = require('express')
const router = express.Router()

// Endpoints

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })

router.get('/', (req, res) => res.render('index'))
router.get('/private', ensureAuthenticated, (req, res) => res.render('profile', { user: req.user }))


module.exports = router
