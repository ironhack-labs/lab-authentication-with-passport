const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {user: req.user});
})

//Signup=> get
router.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

//Signout =>post
router.post('/signup', (req, res, next) => {
  //Guardamos los datos del formulario
  const {username, password} = req.body

  //Que no esten vacios
  let validate = new Promise ((resolve, reject) => {
    if (username === '') return reject(new Error('Username must be filled'))
    else if (password === '') return reject(new Error('Password must be filled'))
    resolve()
  })

  validate.then(() => {
       return User.findOne({username})
  })
    .then(user => {
      if (user) {
        throw new Error('Username already exists')
      }

      //Si esta vacia creamos el usuario
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass
      })

      return newUser.save()
    })
    .then(() => {
      //Usuario correcto => home
      res.redirect('/')
    })
    .catch(err => {
      res.render('passport/signup', {errorMessage: err.message})
    })
})

//Login get 
router.get('/login', (req, res, next) => {
  res.render('passport/login')
})

//Login post 
router.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: true,
    passReqToCallback: true
  })
)
//Private get
router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('passport/private', {user: req.user});
})

//Logout 
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
