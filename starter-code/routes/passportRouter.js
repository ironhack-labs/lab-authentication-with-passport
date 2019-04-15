const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");

// Require user model
const User = require("../models/user");


// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const mongoose = require("mongoose");


const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
    res.render('passport/signup')

});

passportRouter.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("passport/signup", {
            message: "Indicate username and password",
            // "section": "signup"
        });
        return;
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user !== null) {
                res.render("passport/signup", {
                    message: "The username already exists",
                    // "section": "signup"
                });
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
                    res.render("passport/signup", {
                        message: "Something went wrong",
                        // "section": "signup"
                    });
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});
passportRouter.get("/login", (req, res, next) => {
    res.render('passport/login', {
        // "message": req.flash("error"),
        // "section": "login"
    });
});

passportRouter.post("/login", passport.authenticate("local", {
    successReturnToOrRedirect: "/passport/private-page",
    failureRedirect: "/passport/login",
    failureFlash: true,
    passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {
        user: req.user,
        // "section": "private"
    });
});

passportRouter.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

module.exports = passportRouter;