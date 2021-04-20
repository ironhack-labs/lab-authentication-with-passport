const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.model');
const { isLoggedOut, isLoggedIn } = require('../middlewares');
const router = express.Router();
const saltRounds = 10;
// Require user model

router.get('/auth/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup');
})

router.post('/auth/signup', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Username and password are required.'})
  }

  // const regularExpresion = new RegExp('');
  // regularExpresion.test(password)

  if (password.length < 3) {
    res.render('auth/signup', { errorMessage: 'Password should have at least 3 characters'})
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        console.log('usuario')
        return res.render('auth/signup', { errorMessage: 'User already exists.'})
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
     
        .then((newUser) => {
          console.log(hashPass)
          // return res.redirect('/');
          req.login(newUser, (error) => {
            if (error) {next(error)}
            return res.redirect('/auth/private')
          })
        })
        .catch((error) => {console.log(error);
          return res.render('auth/signup', { errorMessage: 'Server error. Try again.'})
        })

    })
});
router.get('/auth/private', isLoggedIn, (req, res) =>{
  res.render('auth/private', {
    user: req.user
  }) 
})

router.get('/auth/login', isLoggedOut, (req, res) => {
  res.render('auth/login');
})

router.post('/auth/login', passport.authenticate("local", {
  successRedirect: "/auth/private",
  failureRedirect: "/auth/login",
  passReqToCallback: true
}));

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', {
    user: req.user
  });
});

module.exports = router;