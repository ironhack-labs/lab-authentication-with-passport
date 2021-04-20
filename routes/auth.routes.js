const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const passport = require('passport');



const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req, res, next) =>{
  res.render('auth/signup', { user: req.user });
});

router.post('/signup', (req, res, next) =>{
  const {username, password} = req.body;
  if (!username || !password){
    return res.render('auth/signup', {errorMessage: 'Username and password are required', user: req.user});
  };

  User.findOne({username})
    .then((user) =>{
      if(user){
        return res.render('auth/signup', {errorMessage: 'Username already exists', user: req.user});
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPassword})
        .then((newUser) =>{
          return res.redirect('/')
        })
        .catch((error) =>{
          return res.render('auth/signup', {errorMessage: 'Server error, try again', user: req.user})
        });
    })
    .catch((error => next(error)));
});


router.get('/login', (req, res, next) =>{
  res.render('auth/login', { user: req.user });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  passReqToCallback: true
}));

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))

router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/')
})

module.exports = router;
