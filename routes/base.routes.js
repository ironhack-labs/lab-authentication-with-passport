const express = require('express')
const router = express.Router()
const passport=require('passport')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })


// Endpoints
router.get('/', (req, res,next) => res.render('index'))

router.get('/profile',checkLoggedIn,(req,res,next)=>{
    res.render('auth/profile',req.user)
    })

module.exports = router
