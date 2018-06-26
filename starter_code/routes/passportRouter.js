const express = require('express');
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt =10;
const User = require('../models/user');

router.get("/signup", (req, res, next) => {
    res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("passport/signup", {
            message: "Username and Password Required"
        });
        return;
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user !== null) {
                res.render("passport/signup", {
                    message: "Username is not available"
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
                        message: "Error, contact sire admin."
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


router.get("/login", (req, res, next) => {
    res.render("passport/login");
  });
  
router.post("/login", passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
res.render("passport/private", { user: req.user });
});

module.exports = router;