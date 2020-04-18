const express = require('express');
const router = express.Router();
// Require user model

const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport

const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

//GET : This one render the form to add the data for sign up !

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

//POST : This one add the data taken from the form to the DATABASE 

router.post('/signup', (req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  let user = new User({ username: req.body.username , password : hashPass})
  user.save().then(() => {
    res.send('You signed up very compliment')
  })

})

//GET : This one render the form to log in 

router.get('/login', (req, res) => {
  res.render('auth/login')
})

//POST : This one checks if the user really exists in the DATABASE

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
  // failureFlash: true,
  // passReqToCallback: true
}))

module.exports = router;
