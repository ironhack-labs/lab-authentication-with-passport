const router = require('express').Router()
const passport = require('../config/passport')
const ensureLogin = require('connect-ensure-login')
// Require user model
const User = require('../models/User')


//Signup
router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'signup',
    register: true
  }
  res.render('passport/form', config)
})
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({...req.body}, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('The user exist, please create a new username')
  }
})

//login
router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log In',
    action: '/login',
    button: 'login'
  }
  res.render('passport/form', config)
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log(req.user, req.session)
  res.redirect('/private-page')
})

router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('passport/private', {
    user: req.user
  })
})


router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

module.exports = router;