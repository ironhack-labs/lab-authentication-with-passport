const express = require('express');
const router = express.Router();
const passport = require('passport')

// Require user model
const User = require('../models/user.model')

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//signup
router.get('/signup', (req, res) => res.render('auth/signup'))
router.post("/signup", (req, res) => {

  const {
    username,
    password
  } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", {
      errorMsg: "Rellene los campos, por favor"
    });
    return
  }

//login

router.get('/login', (req, res) => res.render('auth/login', {
  "message": req.flash("error")
}))

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))
})
  
module.exports = router;
