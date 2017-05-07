const express        = require('express');
const bcrypt         = require('bcrypt');
const passport       = require('passport');
const ensure         = require('connect-ensure-login');

const User           = require('../models/user');

const passportRoute  = express.Router();

passportRoute.get('/private-page', ensure.ensureLoggedIn('/login'), (req, res) => {

  res.render('passport/private');
});

passportRoute.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRoute.post('/signup', (req, res, next) => {

  // username and password inputs from signup form
  const usernameInput   = req.body.usernameInput;
  const pass = req.body.passwordInput;

  // look for username
  User.findOne(
    {username: usernameInput},
    {username: 1},
    (err, theUser) => {
      if (err) {
        next(err);
        return;
      }

      // if a username is found let user know that they have an account
      if (theUser) {
        res.render('passport/signup', {errorMessage: "Username already taken!"});
        return;
      }

      // encrypting password
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(pass, salt);

      // create new user
      const newUser = new User({
        username: usernameInput,
        password: hashPass
      });

      // save the user to the database
      newUser.save( (err) => {
        if (err) {
          next(err);
          return;
        }

        // redirect to home page
        res.redirect('/');
      });
    }
  );
});


passportRoute.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRoute.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login'
  }
));

passportRoute.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});


module.exports = passportRoute;
