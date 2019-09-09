const express = require('express');
const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('../config/passport');
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
passportRouter.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'Sign up',
    register: true
  };
  res.render('passport/signup', config);
});

passportRouter.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password);
    console.log(user);

    res.redirect('/login');
  } catch (e) {
    console.log(e);

    res.send('User already exists');
  }
});

passportRouter.get('/login', (req, res, next) => {
  const config = {
    title: 'Login',
    action: '/login',
    button: 'login'
  };
  res.render('passport/signup', config);
});

passportRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/private');
});

// Add passport

passportRouter.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

module.exports = passportRouter;
