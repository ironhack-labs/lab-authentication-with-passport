const express = require('express')
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {

    const {username, password} = req.body

    User.findOne({username})
        .then(user =>{
            if (user) {
                res.render('auth/signup', {message : "El usuario ya existe"})
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({username, password : hashPass})
                .then(() => res.redirect('/login'))
                .catch(error => next(error))
        })
        .catch(error => next(error))



})

router.get('/login', (req, res) => res.render('auth/login',{ "message": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/private-profile", //OJO DEFINIR RUTA PRIVADA 
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })

router.get('/private-profile', checkLoggedIn, (req, res) => res.render('profile', req.user))

router.get('/logout', (req, res) =>{
    req.logout()
    res.render('auth/login', {message: 'has cerrado sesión'})
})

module.exports = router