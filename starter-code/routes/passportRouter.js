const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user.js");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensure = require("connect-ensure-login");
const passport = require("passport");

router.get("/private-page",
  (req, res) => {
    res.render("passport/private.ejs", {
      user: req.user
    });
  });


router.get('/signup',

  (req, res, next) => {

    res.render('passport/sign-up.ejs');
  }
);


// <form method="post" action="/signup">
router.post('/signup',

  (req, res, next) => {
    const signupUsername = req.body.signupUsername;
    const signupPassword = req.body.signupPassword;

    // Don't let users submit blank usernames or passwords
    if (signupUsername === '' || signupPassword === '') {
      res.render('passport/sign-up.ejs', {
        errorMessage: 'Please provide both username and password.'
      });
      return;
    }

    User.findOne({
        username: signupUsername
      }, {
        username: 1
      },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // Don't let the user register if the username is taken
        if (foundUser) {
          res.render('passport/sign-up.ejs', {
            errorMessage: 'Username is taken, sir or madam.'
          });
          return;
        }

        // We are good to go, time to save the user.

        // Encrypt the password
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(signupPassword, salt);

        // Create the user
        const theUser = new User({
          name: req.body.signupName,
          username: signupUsername,
          encryptedPassword: hashPass
        });

        // Save it
        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }

          // Redirect to home page if save is successful
          res.redirect('/');
        });
      }
    );
  }
);

router.get('/login',

  (req, res, next) => {

    res.render('passport/log-in.ejs');
  }
);

// <form method="post" action="/login">
router.post('/login',
  //                   local as in "LocalStrategy" (our method of logging in)
  //                     |
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res, next) => {
  // req.logout() method provided by Passport
  req.logout();

  res.redirect('/');
});


module.exports = router;
