const express = require('express');
const passportRouter = express.Router();
const User = require('../models/user');
const { hashPassword } = require('../lib/hashing');
const passport = require('passport');
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedIn");

passportRouter.get('/private-page', isLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/login', isLoggedOut(), (req, res, next) => {
    res.render('passport/login')
});

passportRouter.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

passportRouter.get('/signup', (req, res, next) =>
    res.render('passport/signup')
);

passportRouter.post('/signup', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        req.flash('error', 'All fields are required!');
        return res.redirect('/signup');
    }

    try {
        const user = await User.findOne({ username });
        if (user) {
            req.flash('error', 'This user already exists. Please try again with a different Username.');
            return res.redirect('/signup');
        }
        await User.create({ username, password: hashPassword(password) });
        req.flash('sucess', 'User created successfully!');
        return res.redirect('/login')
    } catch (e) {
        next(e);
    }
});

passportRouter.get("/logout", isLoggedIn(), async (req, res, next) => {
    req.logout();
    res.redirect("/");
});

module.exports = passportRouter;