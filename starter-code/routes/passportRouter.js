const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
// Add passport
const passport = require('passport') 


const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body

  if(username === '' || password === '') return res.render('passport/signup', {err: 'Indicate username and password'})

  const user = await User.findOne()

  if(user !== null) return res.render('passport/signup', {err: 'The username already exists'})

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)

  try {
    await User.create({
      username,
      password: hashPassword
    })
    res.redirect('/')
  } catch(err) {
    res.render('passport/signup', {
      err: 'Something went wrong'
    })
  }
})

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})


module.exports = passportRouter;