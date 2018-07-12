const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');



userRouter.get('/signup', (req, res, next) => {
    res.render('users/signupPage');
});


userRouter.post('/signup', (req, res, next) => {
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    
    if (thePassword === "" || theUsername === "") {
        res.render('users/signupPage', { errorMessage: 'Please fill out Username and Password to create an account' });
        return;
    }
    
    User.findOne({ username: theUsername })
    .then((responseFromDB) => {
        if (responseFromDB !== null) {
            res.render('users/signupPage', { errorMessage: `Sorry Username: ${theUsername} is already taken` });
            return;
        }

        //hashes password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(thePassword, salt);
        
        User.create({ username: theUsername, password: hashedPassword })
            .then(() => {
                res.redirect('/');
            })
            .catch(err => console.log('Error while saving signup: ', err));
    });
    
});

userRouter.get('/login', (req, res, next) => {
    res.render('users/loginPage', {message: req.flash('error')});
});

userRouter.post("/login", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));

userRouter.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

userRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("users/privatePage", { user: req.user });
  });

module.exports = userRouter;