const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs')
const saltRounds = 10;
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');



router.get('/signup', (req, res) => {
  res.render('auth/signup');
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Username and password are required.' })
  }
  if (password.length < 3) {
    res.render('auth/signup', { errorMessage: 'Password should have at least 3 characters' })
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.render('auth/signup', { errorMessage: 'User already exists.' })
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then((newUser) => {
          req.login(newUser, (error) => {
            if (error) {
              next(error)
            }
            return res.redirect('/')
          })
        })
        .catch((error) => {
          return res.render('auth/signup', { errorMessage: 'Server error. Try again.' })
        })
    })
    .catch((err) => res.send(err))
});

router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", 
    failureRedirect: "/login",
    passReqToCallback: true 
  }
));

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
