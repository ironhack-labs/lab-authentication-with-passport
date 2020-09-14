const express = require('express');
const router = express.Router();
const flash = require("connect-flash") 
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

// Add passport
const passport = require('passport')
const ensureLogin = require('connect-ensure-login');

router.get('/signup',(req, res, next) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {

  const {username, password} = req.body 

  if(username.length === 0 || password.length === 0){

    res.render('auth/signup', {message : 'Indicate user and password'})
    return
  }

  User.findOne({username})
    .then(user => {

        if (user){
           res.render('auth/signup', {message: 'The username exists'})
           return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({username, password: hashPass})
            .then(() => res.redirect('/'))
            .catch(err => next(err))

    })
    .catch(err => next(err))

})

router.get('/login', (req, res, next) => res.render('auth/login', {'message':  req.flash('error')}))
router.post('/login', passport.authenticate('local', {
  successRedirect: "/private",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))




router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
