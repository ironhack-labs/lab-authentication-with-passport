const express        = require("express");
const router = express.Router();
// Require user model
const User = require('../models/user.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport 
const passport = require('passport')

// const ensureLogin = require("connect-ensure-login");


// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


// Registro
router.get("/signup", (req, res) => res.render("passport/signup"))
router.post("/signup", (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("passport/signup", { message: "Rellena lo todo cabezon" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("passport/signup", { message: "El usuario ya esta" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("passport/signup", { message: "Algo ha ido mal" }))
        })
        .catch(error => next(error))
})

router.get("/login", (req, res) => res.render("passport/login", { message: req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



module.exports = router;