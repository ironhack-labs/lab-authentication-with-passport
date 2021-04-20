const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) =>{
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) =>{
  const {username, password} = req.body;
  if (!username || !password){
    res.render('auth/signup', {errorMessage: 'Username and password are required'});
  };

  User.findOne({username})
    .then((user) =>{
      if(user){
        res.render('auth/signup', {errorMessage: 'Username already exists'});
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPassword})
        .then((newUser) =>{
          res.redirect('/')
        })
        .catch((error) =>{
          res.render('auth/signup', {errorMessage: 'Server error, try again'})
        });
    })


});

module.exports = router;
