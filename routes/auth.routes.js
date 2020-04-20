const express = require('express')
const router = express.Router()

// Require user model

const User = require('../models/User.model')

// Add bcrypt to encrypt passwords

const bcrypt = require('bcryptjs')
const bcryptSalt = 10

// Add passport

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Por favor, rellena el formulario con usuario y contraseña.',
    })
    return
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'Este usuario ya existe' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/')
        })
        .catch((err) => {
          res.render('auth/signup', {
            errorMsg: 'No se ha podido crear el usuario',
          })
        })
    })
    .catch((err) => next(err))
})

const ensureLogin = require('connect-ensure-login')

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user })
})

module.exports = router
