const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")

// Add passport
const passport = require("../configs/passport")

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get("/signup", async (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
  
  //1. get info from form
  const {username, password} = req.body

  //2. check no empty form
  if (username ==="" || password==="") {
    return res.render('auth/signup', {error: "Please enter username and password"})
  }

  //3. check that a user with the same email does not already exist
  const user = await User.findOne({username})
  if (user) {
    return res.render('auth/signup', {error: "Try again"})
  }

  //4. If the user does not already exist, create a hash from password
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  
  //5. add user to database
  await User.create({
    username,
    password: hashPass
  })
  
  //6. Redirect to login after sign up
  res. redirect("/login")
})

router.get("/login", async (req, res) => {
  res.render('auth/login', {error: req.flash("error") })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;
