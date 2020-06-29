const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints
router.get('/', (req, res) => res.render('index'))

// SIGN UP
router.get("/registro", (req, res) => res.render("auth/signup"))

router.post("/registro", (req, res) => {
    const {
        username,
        password
    } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", {
            errorMsg: "¡Rellena los campos merluzo!"
        })
        return
    }

    User
        .findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/signup", {
                    errorMsg: "¡Usuario ya existente merluzo!"
                })
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({
                username,
                password: hashPass
            })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error merluzo!", err))
})

// Login
router.get('/loguearseTronco', (req, res) => res.render('auth/login', {
    "message": req.flash("error")
}))

router.post('/loguearseTronco', passport.authenticate("local", {

    succesRedirect: "/",
    failureRedirect: "/loguearseTronco",
    failureFlash: true,
    passReqToCallback: true
}))



module.exports = router