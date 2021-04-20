const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const saltRounds = 10;
const User = require('../models/User.model')
const ensureLogin = require('connect-ensure-login');



router.get('/signup', (req, res) => {
  res.render('auth/signup')
})
router.post('/signup', (req, res, next) =>{
  const {username, password} = req.body;
  if(!username || !password){
    res.render('auth/signup', {errorMessage: "You need to fill both fields"})
  }
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashPassword = bcrypt.hashSync(password, salt);
  User.findOne({username})
  .then((user)=>{
    if(user){
      res.render('auth/signup', {errorMessage: "The user already exists"})
    }
    User.create({username, password: hashPassword})
    .then((user)=>{
      req.login(user, (error)=>{
        if(error) next(error); //next corta la ejecución
        return res.redirect('/auth/private-page')
      }) 
    })
    .catch((error) =>{
      console.error(error);
      res.render('auth/signup', {errorMessage: "Server error. Try again"})

    })

  })
})

router.get('/login', (req, res) =>{
  res.render('auth/login', {errorMessage: req.flash('error')[0]})
})
router.post('/login', passport.authenticate('local', {
  successRedirect:"/auth/private-page",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true

}))

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/')
})

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
