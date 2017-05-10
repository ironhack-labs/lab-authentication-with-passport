const express        = require("express");
const passportRouter = express.Router();
// User model
const User           = require("../models/user.js");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) => {
  res.render('passport/signup.ejs');
});

passportRouter.post('/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) => {
    const signupUsername = req.body.signupUsername;
    const signupPassword = req.body.signupPassword;

  // Don't let users submit blank usernames or passwords
    if (signupUsername === '' || signupPassword === '') {
      res.render('passport/signup.ejs', {
        errorMessage: 'Please provide both username and password'
      });
      return;
    }
    User.findOne(
      { username: signupUsername},
      { username: 1},
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }
        if (foundUser) {
          res.render('passport/signup.ejs', {
            errorMessage: 'Username already exists'
          });
          return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(signupPassword, salt);

        const theUser = new User ({
          username: signupUsername,
          encryptedPassword: hashPass
        });

        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }

          req.flash(
            'success',
            'You have successfully registered!'
          );

          res.redirect('/');
        });
      }
    );
  }
);

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login.ejs', {
    errorMessage: req.flash('error')
  });
});
// <form method="post" action="/login">
passportRouter.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    successFlash: true,
    failureRedirect: '/login',
    failureFlash: true
  } )
);

passportRouter.get('/logout', (req, res, next) => {
  // req.logout() method provided by Passport
  req.logout();

  req.flash('success', 'You have logged out successfully');

  res.redirect('/');
});

module.exports = passportRouter;
