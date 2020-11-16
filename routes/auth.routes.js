const express = require('express');
const router = express.Router();
// Add passport
const passport = require('passport')


// Require user model
const User = require('../models/user.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10


// const ensureLogin = require('connect-ensure-login');

// router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render('passport/private', { user: req.user });
// });

// router.get('/', (req, res) => res.render('index'))


//1. SignUp
router.get('/signup', (req, res) => {

  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body

  if (username === "" || password === "") {
    res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
    return
}

User
    .findOne({ username })
    .then(user => {
          if (user) { res.render("auth/signup", { errorMsg: "El usuario ya existe" })
            return
          }
      
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
        
    User
      .create({
        username,
        password: hashPass
      })
      .then(() => res.redirect('/'))
      .catch(() => res.render("auth/signup", {
        errorMsg: "Hubo un error"
      }))
    })
    .catch(error => next(error))
})


//2.LogIn

router.get('/login', (req, res, next) => {

  res.render('auth/login', {errorMsg: req.flash("error")})

})


router.post('/login', passport.authenticate('local', {
  
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,

}) )




module.exports = router;