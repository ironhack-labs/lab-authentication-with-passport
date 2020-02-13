const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// Add passport 

const passport = require('passport');
const ensureLogin = require("connect-ensure-login");

// GET route for signup page
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

// POST route for signup form
passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.render('passport/signup', { message: 'Indicate username and password.' });
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    console.log('Password hash: ', hashedPassword);
    return User.create({
      username,
      password: hashedPassword
    });
  })
  .then(() => {
    res.redirect('/login');
  })
  .catch(err => {
    res.render('passport/signup', { message: 'Something went wrong'});
  });
});

// GET route for login page
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login', { message: req.flash('error') });
});

// POST route for login
passportRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

// GET route to private page to ensure user is logged in
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// GET route to logout
passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = passportRouter;