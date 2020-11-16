const express = require('express');
const router = express.Router();
// Require user model

const User = require("./models/User.model");

// Add bcrypt to encrypt passwords

const bcrypt = require("bcrypt");

// Add passport

const passport = require("passport");

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body
    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }
            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})


router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router;
