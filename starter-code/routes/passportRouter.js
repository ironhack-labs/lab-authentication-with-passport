const express = require('express');
const passportRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get("/signup", (req, res, next) =>
    res.render("passport/signup")
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
        return res.redirect('/')
    } catch (e) {
        next(e);
    }
});

module.exports = passportRouter;