const express = require('express');
const router = express.Router();
// Require user model
const User = require("../models/User.model")


// Add passport
const passport = require("passport");


// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//SIGN UP
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (username.length === 0 || password.lenght === 0) {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }


  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'Usuario ya registrado' })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      return User.create({ username, password: hashPass })

    })
    .then(() => res.redirect('/'))
    .catch(err => console.log("Error!:", err))

})


//LOGIN
router.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))








const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
