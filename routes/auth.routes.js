const express = require('express');
const bcrypt = require("bcryptjs")
const router = express.Router();
const saltRound = 10;
// Require user model
const User = require('../models/User.model');

//SIGNUP
router.get('/signup', (req, res, next) => {
  res.render('signup');
} )

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.render('signup', { errorMessage: "Username and password are required"})
  }

  User.findOne({username})
  .then(user => {
    if (user) {
      res.render('signup', { errorMessage: "User already exists"})
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
      return res.render('signup', { errorMessage: "Server error. Try again."})
    })
  })
})
// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
