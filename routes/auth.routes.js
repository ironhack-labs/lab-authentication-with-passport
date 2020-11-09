const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
const { isAuth } = require('../middlewares')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')

// Add passport
const passport = require('../config/passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
  //Extraer info del form
  const {username, password} = req.body
  //Verificar la informacion
  if (!username || !password) {
    return res.render('auth/signup', {
      errorMessage: 'Indicate username and password'
    })
  }
  const user = await User.findOne({ username })
  if (user) {
    return res.render('auth/signup', {
      errorMessage: 'Error ✖'
    })
  }
  //Hacemos el HASH de la contrase~a
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  //Creamos al usuario
  const newUser = await User.create({
    username,
    password: hashPass
  })

  //add the new user to the session
  req.user = newUser
  //redirijimos al usuario
  res.redirect('/private')
})

router.get('/login', (req, res) => {
  res.render('auth/login', { errorMessage: req.flash('error') })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/private', isAuth, (req, res) => {
  res.render('auth/private', req.user)
})

module.exports = router;
