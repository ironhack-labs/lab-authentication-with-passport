'use strict';
/* jshint esversion: 6, node: true */

const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {
        user: req.user
    });
});

router.get("/signup", (req, res, next) => {
    res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (username === '' || password === '') {
        return res.render('passport/signup', {
            errorMsg: 'username/password cannot be blank.'
        });
    }

    User.findOne({
        username
    }, (err, doc) => {
        if (err) return next(err);
        if (doc) {
            return res.render('passport/signup', {
                errorMsg: 'username already exists.'
            });
        }

        bcrypt.hash(password, bcryptSalt, (err, hash) => {
            if (err) return next(err);
            const newUser = User({
                username,
                password: hash
            });
            newUser.save((err) => {
                if (err) return next(err);
                res.redirect('/login');
            });
        });
    });
});

router.get('/login', (req, res, next) => {
  const m = req.flash("error");
  console.log(typeof(m), m);
  res.render('passport/login', { "message": m});
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
