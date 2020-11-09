const UserModel = require("../models/User.model");
const bcrypt = require('bcryptjs');
const passport = require("../configs/passport");

module.exports = {
    signupGET(req, res) {
        res.render('auth/signup');
    },
    signupPOST(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.render('auth/signup', { error: 'Please, try again.' });
        UserModel.findOne({ username })
            .then(user => {
                if (user) return res.render('auth/signup', { error: 'User already exist. Please, Login.' });
                const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(12));

                UserModel.create({ username, password: hashed });
                return res.redirect('/');
            })
            .catch(() => res.render('auth/signup', { error: 'User already exist. Please, Login.' }));

    },
    loginGET(req, res) {
        res.render('auth/login', { "errorMessage": req.flash('error') });
    },
    loginPOST: passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    }),
    privateGET(req, res) {
        res.render('auth/private', { user: req.user });
    }
};