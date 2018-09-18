//const express        = require("express");
//const router         = express.Router();
const router = require('express').Router()
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
//const bcrypt         = require("bcrypt");
//const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


//1.- signup
router.get('/signup', (req, res)=>{
  res.render('passport/signup')
})

router.post('/signup', (req, res, next)=>{
  User.register(req.body,req.body.password)
  .then(usser=>{
    //El usuario ya se creo
    res.redirect('/passport/login')
  })
  .catch(error=> next(error))
})

//2.-
router.get('/login', (req,res,next)=>{
  res.render('passport/login')
})

router.post('/login', passport.authenticate('local'),(req, res, next)=>{
  //si el usuario si existe
  console.log(req.user)
  res.redirect('/private-page')
})


router.get('/logout', (req,res)=>{
  req.logOut()
  res.redirect('/')
})



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
