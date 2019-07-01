const express = require("express");
const passportRouter = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require("connect-ensure-login");


// Require user model
passportRouter.get("/signup", (req, res) => {
    res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("/signup", { message: "The username already exists" });
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
                    res.render("/signup", { message: "Something went wrong" });
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});

passportRouter.get("/login", (req, res) => {
    res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;