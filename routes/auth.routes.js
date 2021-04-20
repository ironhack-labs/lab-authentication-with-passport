const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares');
const router = express.Router();
const saltRounds = 10;
// Require user model

router.get('/signup', isLoggedOut,(req, res) => {
  res.render('signup');
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('signup', { errorMessage: 'Username and password are required.' })
  }

  // const regularExpresion = new RegExp('');
  // regularExpresion.test(password)

  if(password.length < 3){
    res.render('signup', { errorMessage: 'Password should have at least 3 characters' })
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.render('signup', { errorMessage: 'User already exists.' })
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then((newUser) => {
          // return res.redirect('/');
          req.login(newUser, (error) => {
            if(error){
              next(error)
            }
            return res.redirect('/private/profile')
          })
        })
        .catch((error) => {

          console.log(error);
          return res.render('signup', { errorMessage: 'Server error. Try again.' })
        })

    })
});

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
