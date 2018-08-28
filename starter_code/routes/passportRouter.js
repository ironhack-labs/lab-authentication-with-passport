const express = require('express');
const router = express.Router();
// User model
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
const bodyParser = require('body-parser');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
    res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    const encrypted = bcrypt.hashSync(password, 10);

    new User({ username, password: encrypted })
        .save()
        .then(result => {
            res.send('User account was created');
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.render('signup', { error: 'user exists already' });
            }
            console.error(err);
            res.send('something went wrong');
        });
});

router.get('/login', (req, res, next) => {
    res.render('passport/login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/passport/login',
        failureFlash: true
    })
);

router.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    })
);

router.get(
    '/google/cb',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/'
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
