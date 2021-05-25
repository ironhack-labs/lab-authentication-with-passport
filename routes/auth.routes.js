const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 12;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../middleware');


// const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Tell me your username and password' });
    return;
    }
    const oldUser = await User.findOne({username});
    if (oldUser !== null) {
        res.render('auth/signup', { errorMessage: 'The username or password already exists' });
        return;
    }
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    res.redirect('/');
  } catch (e) {
    next(e);
  }
});

router.get('/login', (req, res, next) =>  {
  res.render('auth/login', { errorMessage: req.flash('error')});
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/private-page', isLoggedIn, (req, res, next) => {
    res.render('auth/private', { user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
//Req object has an isAuthenticated method attached to it! So you can req.isAuthenticated to check if user is logged in or not, WRITE LIKE THIS (also see it in use in the isLoggedIn middleware):
// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res, next) => {
//   if(req.isAuthenticated()) {
//     res.redirect('/private-page');
//   } else {
//     res.send('LOGGING');
//   }
// });

