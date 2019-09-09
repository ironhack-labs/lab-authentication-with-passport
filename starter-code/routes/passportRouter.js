const router = require('express').Router()
const passport = require('../config/passport')

const User = require('../models/User')

//const ensureLogin = require('connect-ensure-login')
router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign up',
    action: '/signup',
    button: 'Sign up',
    register: true
  }
  res.render('auth/form', config)
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log In',
    action: '/login',
    button: 'Log in'
  }
  res.render('auth/form', config)
})
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log(req.user, req.session)
  res.redirect('/profile')
})

router.get('/profile', (req, res, next) => {
  res.render('auth/profile', { user: req.user })
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('login')
  }
}

module.exports = router
