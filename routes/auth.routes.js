const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login')

// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')

// Add passport



router.get('/private-page', ensureLogin.ensureLoggedIn('login'), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {

  const {username, password} = req.body

  if(username === '' || password === '') {
    res.render('signup', {errMessage: 'You have to fill the inputs email and password'})
    return 
  }

  User.findOne({username}) 
  .then(user => {
    if(!user) {
      bcrypt.hash(password, 10)
      .then(hashedPass => {
        User.create({username, password: hashedPass})
        .then(() => {
          res.redirect('/')
        })
      })
    } else {
      res.render('signup', {errMessage: 'This user already exist'})
    }
  })
  .catch(err => console.log(err))
})


router.get('/login', (req, res, next) => {
  res.render('auth/login', {errMessage: req.flash('error')})
})

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))





module.exports = router;