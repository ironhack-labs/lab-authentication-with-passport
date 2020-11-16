const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/privado', ensureAuthenticated, (req, res) => res.render('auth/private'))


module.exports = router
