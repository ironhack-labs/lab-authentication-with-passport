const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10



//Signup form
router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res) => {

  const { username, password } = req.body


  if (username.length === 0 || password === 0) {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }


  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render('auth/signup', { message: 'The username already exists' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)


      User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})



//Login
router.get('/login', (req, res) => res.render('auth/login', { 'message': req.flash('error') }))
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;
