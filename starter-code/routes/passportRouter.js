const express        = require("express");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const passRoutes     = express.Router();
const User           = require("../models/user.js");
const ensure = require('connect-ensure-login');

passRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passRoutes.get('/signup',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
    res.render('passport/signup.ejs');
  }
);


passRoutes.post('/signup',
  ensure.ensureNotLoggedIn('/'),

  (req, res, next) => {
    const signupUsername = req.body.signupUsername;
    const signupPassword = req.body.signupPassword;

    if (signupUsername === '' || signupPassword === '') {
      res.render('views/passport/signup.ejs', {
        errorMessage: 'Please provide both username and password.'
      });
      return;
    }

    User.findOne(
      { username: signupUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        if (foundUser) {
          res.render('passport/signup.ejs', {
            errorMessage: 'Username is taken, sir or madam.'
          });
          return;
        }


        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(signupPassword, salt);

        const theUser = new User({
          name: req.body.signupName,
          username: signupUsername,
          encryptedPassword: hashPass
        });

        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }

          res.redirect('/');
        });
      }
    );
  }
);

passRoutes.get('/login',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
    res.render('passport/login.ejs');
  }
);
passRoutes.post('/login',
  ensure.ensureNotLoggedIn('/'),
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  } )
);
passRoutes.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = passRoutes;
