const express = require('express');
const router = express.Router();

const passport = require('passport')

// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport


// GET route /signup
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// POST route /signup
router.post('/signup', (req, res, next) => {

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({
    username: req.body.username,
    password: hashPass
  })
  user.save().then(() => {
    res.send('worked')
  }).then(() => {      res.redirect('/auth/login');    })
})

// GET route /login
router.get('/login', (req, res) => {
  res.render('auth/login')
})

/* // POST route /login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/private', 
  failureRedirect: '/login',
  // failureFlash: true,
  // passReqToCallback: true
}))


// DRY !!
// this is a middleware
let loggedInUser = (req, res, next) => {

  if (req.user) {
    next()
  } else {
    res.redirect('/login?')
  }
}
*/

const ensureLogin = require('connect-ensure-login');

router.post('/login', passport.authenticate(ensureLogin, {
  successRedirect: '/private-page',
  failureRedirect: '/login',
}))


router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', {
    user: req.user
  });
}); 


router.get('/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('auth/logout');
})



module.exports = router;