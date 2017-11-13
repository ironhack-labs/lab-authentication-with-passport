"use strict";

const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", { user: req.user });
});


//LOGIN

router.get('/login', function(req, res, next) {
    res.render('passport/login', { message: req.flash('error') });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));


// SIGNUP
router.get('/signup', function(req, res, next) {
    User.find({}, (err, users) => {
        if (err) {
            next(err);
        } else {
            const data = {
                users: users
            };
            res.render('passport/signup', data);
        }
    });

});

router.post('/signup', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username === "" || password === "") {
        res.render("passport/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({
            "username": username
        },
        "username",
        (err, user) => {
            if (user !== null) {
                res.render("passport/signup", {
                    errorMessage: "The username already exists"
                });
                return;
            }

            var salt = bcrypt.genSaltSync(bcryptSalt);
            var hashPass = bcrypt.hashSync(password, salt);

            var newUser = User({
                username: username,
                password: hashPass
            });
            newUser.save((err) => {
                if (err) {
                    next(err);
                }
                res.redirect("/");
            });
        });
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", { user: req.user });
});

module.exports = router;
