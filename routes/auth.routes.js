const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport
const passport = require('passport')


const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req, res, next) =>  {
res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({ username: req.body.username, password: hashPass })
  user.save().then(() => {
    res.redirect('/login')
    //res.redirect('/login')
  })
})

router.get('/login', (req,res,next) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;
