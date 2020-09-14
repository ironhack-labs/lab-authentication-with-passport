const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.get('/signup', (req, res, next) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {

  const { username, password } = req.body

  if (!username.length || !password.length) {
    res.render('auth/signup', { message: 'Indicate username and password'})
    return
  }

  User.findOne( {username })
    .then(user => {
      if(user) {
        res.render('auth/signup', { message: 'The username already exists'})
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create( { username, password: hashPass})
      .then(() => res.redirect('/'))
      .catch(err => next(err))

    })

    .catch(err => next(err))

})

router.get('/login', (req, res, next) => res.render('auth/login', { 'message': req.flash('error') }))
router.post('/login', passport.authenticate('local', {

  successRedirect: '/private',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true

}))

router.get('/logout', (req, res, next) => {
  req.logout()
  res.render('auth/login', { message: 'Logged out'})
})

module.exports = router;
