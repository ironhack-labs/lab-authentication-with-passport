const express = require('express')
const router = express.Router()
const User = require('./../models/User.model.js')
const bcrypt = require("bcryptjs")
const bcryptSalt = 10
const passport = require('passport')

// Endpoints
router.get('/signup', (req, res, next) => res.render("auth/signup"))

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password,salt)
    User
        .create({ username, password:hashPass })
        .then(() => res.render("index", {successMsg:"Registro completado"}))
    .catch(err=>next(err))
})

router.get('/login', (req, res, next) => res.render("auth/login",{errorMsg:req.flash("error")}))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// Cerrar sesión
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router
