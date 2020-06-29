const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/signup',(req,res) => res.render('auth/signup'))

router.post('/signup',(req,res) => {
const {username,password} =req.body

if (username.length === 0 || password.length === 0) {
  res.render("auth/signup", { errorMsg: "Fill the fields" });
  return
}

User
.findOne({ username })
.then(user => {
    if (user) {
        res.render("auth/signup", { errorMsg: "The username already exists" });
        return
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    return User.create({ username, password: hashPass })
})
.then(userCreated => userCreated ? res.redirect('/') : null)
.catch(err => console.log("Error!:", err))

})

router.get('/login',(req,res) => res.render('auth/login',{"message":req.flash('error')}))

  router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/private-page', checkAuthenticated, (req, res) => res.render('auth/private', { user: req.user }))

module.exports = router;
