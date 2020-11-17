const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

// Add passport
const passport = require('passport')


const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if(username === '' || password === ''){
    res.render('auth/signup', {errorMessage: 'Need username or password!'})
  }else {
    User.findOne({ username })
      .then(user => {
        if(user){
          res.render('auth/signup', {errorMessage: 'This username already exists'})
        }else {
          bcrypt.genSalt(bcryptSalt)
            .then(salt => {
              bcrypt.hash(password, salt)
                .then(hashedPwd => {
                  const newUser = {
                    username,
                    password: hashedPwd
                  }
                  User.create(newUser)
                    .then(createdUser => {
                      res.redirect('/private-page')
                    })
                })
            })
        }
      })
      .catch(err=> {
        console.error(err)
        res.send(err)
      })
  }
  
})

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;
