const express = require('express')
const router = express.Router()


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() :
 res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role))
            next()
        else 
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
    }
}
// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/private', checkLoggedIn, (req, res, next) => res.render('auth/private', { user: req.user }))

module.exports = router
