const express = require('express');
const router = express.Router();

const passport = require('passport')

// Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport


router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({ username: req.body.username, password: hashPass })
  user.save().then(() => {
    res.send('worked')
    req.login(user, () => { 
      res.redirect('/') })
  })
})


router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

// use LocalStrategy for authentication
router.post('/login', passport.authenticate('local', {
  successRedirect: '/private', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
  // failureFlash: true,
  // passReqToCallback: true
}))

const ensureLogin = require('connect-ensure-login');

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('auth/private', { user: req.user});
})

router.get('/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('auth/logout')
  res.redirect('/')
})





/* router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
}); */




module.exports = router;
