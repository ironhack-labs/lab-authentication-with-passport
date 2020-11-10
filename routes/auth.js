const express = require('express');
const router = express.Router();
// Require user model
const User = require("../models/User.model")
// // Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
// // Add passport
const passport = require("../config/passport.js")
const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req,res)=>{
  res.render('auth/signup')
})

router.post('/signup', async (req, res) => {

  const {username, password} = req.body

  if(!username || !password) {
    return res.sender("auth/signup", {
      errorMessage: "Indicate username and password"
    })
  }

  const user = await User.findOne({ username })

  if (user) {
    return res.render("auth/signup", {
      errorMessage: "Error X"
    })
  }

  const salt = bcrypt.genSaltSync(12)
  const hashPwd = bcrypt.hashSync(password, salt)

  await User.create({
    username,
    password: hashPwd
  })

  res.redirect("/login")

})
router.get('/login',(req, res)=> {
  res.render("auth/login")
})
router.get('/login',(req, res)=> {
  res.render("auth/login", {errorMessage: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/private-page', (req, res)=> {
  if(!req.user) return res.redirect('/')
  res.render('auth/private')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})


module.exports = router;