const express = require('express');
const router = express.Router();
const {isLogedout} = require('../middlewares');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRound = 10;
const passport = require('passport')
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req,res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const {username, password} = req.body;

  if(!username || !password) {
    res.render('auth/signup', {errorMessage: 'Username and password are required!'});
  }

  User.findOne({username})
  .then(user => {
    if(user) {
      res.render('auth/signup', {errorMessage: 'User already exists!'})
    }
    const salt = bcrypt.genSaltSync(saltRound);
    const hashPassword = bcrypt.hashSync(password, salt);

    User.create({username, password: hashPassword})
    .then(() => {
      res.render('auth/private');
    })
    .catch((error) => console.error(error));
  })
})


router.get('/login' ,(req, res) => {
  res.render('auth/login');
})
router.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/auth/login",
  passReqToCallback: true
}));

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
   res.render('auth/private', { user: req.user });
 });


module.exports = router;
