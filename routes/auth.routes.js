const express = require('express');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const router = express.Router();
const saltRound = 10;
const { isLoggedOut, isLoggedIn } = require('../middlewares')
// Require user model
const User = require('../models/User.model');

//SIGNUP
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
} )

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.render('auth/signup', { errorMessage: "Username and password are required"})
  }

  User.findOne({username})
  .then(user => {
    if (user) {
      res.render('auth/signup', { errorMessage: "User already exists"})
    }

    const salt = bcrypt.genSaltSync(saltRound);
    const hashPassword = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPassword})
    .then((newUser) => {
      req.login((newUser), (error) => {
        if(error){
          next(error)
        }
        res.redirect("/")
      })
    })
    .catch((error) => {
      console.log(error);
      return res.render('auth/signup', { errorMessage: "Server error. Try again."})
    })
  })
})

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login');
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/auth/private",
  failureRedirect: "/auth/login",
  passReqToCallback: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
})

const ensureLogin = require('connect-ensure-login');

router.get('/private', isLoggedIn, (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
