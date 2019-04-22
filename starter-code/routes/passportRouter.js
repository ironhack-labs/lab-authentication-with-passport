const express = require('express');
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

const passportRouter = express.Router();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});
passportRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('passport/signup', {
      message: 'You need to pass information.'
    });
  }

  const user = await User.findOne({ username });
  if (user) {
    return res.render('passport/signup', {
      message: 'Username already exists.'
    });
  }

  const newUser = await User.create({
    username,
    password: await bcrypt.hash(password, 10)
  });

  try {
    newUser.save();
    res.redirect('/');
  } catch (err) {
    console.log('Error while creating users.', err);
    res.redirect('/signup');
  }
});

passportRouter.get('/login', (req, res) => {
  res.render('passport/login');
});
passportRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    //failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.get(
  '/private-page',
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render('passport/private', { user: req.user });
  }
);

module.exports = passportRouter;
