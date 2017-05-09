const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) => {
  res.render('passport/signup.ejs');
});

router.post('/signup',
  ensureLogin.ensureNotLoggedIn('/')),
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
          res.render('passport/signup,ejs', {
            errorMessage: 'Username already exists'
          });
          return;
        }

      }
    )

  }







module.exports = router;
