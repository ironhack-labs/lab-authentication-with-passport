'use strict';

const express = require('express');
const router = express.Router();
// User model
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
const googleStrategy = require('passport-google').Strategy;

// middleware
// router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render('passport/private', { user: req.user });
// });

//WIP - figuring out how to reconfigure Google Plus API to use personal data instead of public...
passport.use(new GoogleStrategy({
  clientID: "1cb0a63e6b28f0e4bc80e48918b3519837361e64",
  clientSecret: "your Google client secret here",
  callbackURL: "/auth/google/callback"
  // returnURL: 'http://localhost:3000/auth/google/return',
  // realm: 'http://localhost:3000/'
  },
  (identifier, done) => {
    User.findByOpenID({ openId: identifier }, 
      (err, user) => {
      return done(err, user);
    });
  }
  const newUser = new User({
    facebookID: profile.id
  });

  newUser.save((err) => {
    if (err) {
      return done(err);
    }
    done(null, newUser);
  });
  });

}));
));

module.exports = router;
