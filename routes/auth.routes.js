const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})
router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }
    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", { message: "The username already exists" });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
            const newUser = new User({
                username,
                password: hashPass
            });
            newUser.save((err) => {
                if (err) {
                    res.render("auth/signup", { message: "Something went wrong" });
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
})
router.get("/login", (req, res, next) => {
    res.render("auth/login", {
        message: req.flash('error')
    });
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
}));

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('auth/private', { user: req.user });
});

module.exports = router;