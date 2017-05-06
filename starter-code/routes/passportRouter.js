const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const mongoose       = require('mongoose');
const layouts        = require('express-ejs-layouts');


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private.ejs", { user: req.user });
});


router.get('/signup', (req, res, next) => {
    res.render('passport/signup.ejs');
});

router.post('/signup', (req, res, next) => {
    const signupUsername = req.body.signupUsername;
    const signupPassword = req.body.signupPassword;

    if( !signupUsername || !signupPassword ) {
        res.render('passport/signup',
            {
                errorMessage: 'Please enter username and password'
            }
        );
        return;
    }

    User.findOne(
        { username: signupUsername },
        { username: 1 },
        //callback
        (err, foundUser) => {
            if(err) {
                next(err);
                return;
            }

            if(foundUser) {
                res.render('/signup', {
                    errorMessage: 'This username is already taken'
                });
                return;
            }

            const salt = bcrypt.genSaltSync(10);
            //encrypt password with bcrypt
            const encryptedPass = bcrypt.hashSync(signupPassword, salt);

            //create new user based on information from form
            const newUser = new User({
                username: signupUsername,
                password: encryptedPass
            });
            //Save the newly created user
            newUser.save((err) => {
                if(err) {
                    next(err);
                    return;
                }
                res.redirect('/');
            });
        }
    );

});

router.get('/login', (req, res, next) => {
    res.render('passport/login');
});



router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    })
);


module.exports = router;
