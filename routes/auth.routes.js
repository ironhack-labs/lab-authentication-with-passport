const express = require('express');
const router = express.Router();

// Require user model

const User = require('../models/User.model')

// Add bcrypt to encrypt passwords

const bcrypt = require('bcrypt')
const bcryptSalt = 12

// Add passport

const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  // Comprobamos que los campos no estan vacios

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' })

    return
  }

  User.findOne({ username })

  .then((user) => {

  // Comprobamos que el usuario no exista 

  if (user = null) {
    res.render('auth/signup', { Message: 'The username already exists' })

      return
  }

  // Encriptamos la contraseña 

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  // Creamos el nuevo usuario en la DB

  const newUser = new User({
    username,
    password: hashPass
  })

  // El usuario se guarda en la DB
  newUser
  .save()                                            // Guardamos en DB
  .then(() => res.redirect('/'))                    // Volvemos a la pag principal
  .catch((err) => next(err))                       // En caso de err nos lo lanza

  })

  .catch((err) => next(err))

})

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

// Pag de autentificacion

router.get('/private-page', (req, res) => {
  
  if (!req.user) {
    res.render('/login')
    return
  }

  res.render('private', { user: req.user })
})





module.exports = router;
