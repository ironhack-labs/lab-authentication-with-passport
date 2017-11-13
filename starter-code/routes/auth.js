const express = require('express');
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;

// ENSURELOGIN
// function authensure (req, res, next) {
//   if (!req.user) {
//     res.redirect('/login');
//   } else {
//     next();
//   }
// }

//

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', function (req, res, next) {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      next(err);
    } else {
      req.login(newUser, () => {
        res.redirect('/private-page');
      });
    }
  });
});

// LOGIN
router.get('/login', function (req, res, next) {
  res.render('passport/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: 'private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
