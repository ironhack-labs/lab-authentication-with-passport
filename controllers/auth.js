// Require user model
const User = require('../models/User.model');
// Require bcrypt for encrypting passwords
const {
    genSaltSync,
    hashSync
} = require('bcryptjs');
// Require passport
const passport = require('../config/passport');

exports.signupView = (req, res) => {
    res.render('auth/signup');
}

exports.signupProcess = async(req, res) => {
    const {
        username,
        password
    } = req.body;

    if (username === '' || password === '') return res.render('auth/signup', {
        error: 'Missing fields'
    });

    const user = await User.findOne({
        username
    });
    if (user) return res.render('auth/signup', {
        error: 'Error... please try again'
    })

    const hashPwd = hashSync(password, genSaltSync(12))

    await User.create({
        username,
        password: hashPwd
    })

    res.redirect('/login');
}

exports.loginView = (req, res) => {
    res.render('auth/login', {
        error: req.flash('error'),
        user: req.user
    });
}

exports.loginProcess = passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true
})

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/')
}