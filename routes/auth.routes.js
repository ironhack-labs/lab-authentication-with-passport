const express = require('express')
const router = express.Router()
const passport = require("passport")


const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Not autorized, sign in' })



// Registro (renderizado formualrio)
router.get("/signup", (req, res) => res.render("auth/signup"))

// Registro (gestión)
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill all fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "Username taken" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Error" }))
        })
        .catch(error => next(error))
})



// Inicio sesión (renderizado formulario)
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Inicio sesión (gestión)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))




// Private page
router.get('/private-page', ensureAuthenticated, (req, res) => res.render('auth/private', { user: req.user }))





// Cerrar sesión
router.get('/signout', (req, res) => {
    req.logout()
    res.redirect("/login")
})



module.exports = router
