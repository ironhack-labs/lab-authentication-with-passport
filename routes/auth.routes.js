const express = require('express');
const router = express.Router();

// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')

// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', {user: req.user});
});

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {

  const {username, password} = req.body

  //Verificar que el usuario y contraseña no estén vacíos
  if (username === '' || password === '') {
    res.render('signup', {errorMessage: 'Tienes que rellenar todos los campos'})
  }
  //Verificar que el usuario que intentas crear no exista ya
  User.findOne({username})
    .then((user) => {
      if (user) {
        res.render('signup', {errorMessage: 'Este usuario ya existe'})
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({username, password: hashedPassword })
          .then(() => {
            res.redirect('/login')
          })
      }
    })
    .catch((err) => {
      res.send(err)
    });
})


router.get('/login', (req, res) => {
  res.render('auth/login', {errorMessage: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

/* GET logout page */
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})





module.exports = router;