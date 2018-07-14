const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

function isAuth(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/private-page');
  } else {
    next();
  }
}

router.get('/signup', isLoggedIn, (req,res)=>{
  res.render('passport/signup');
});

router.post('/signup', (req,res)=>{
  if(req.body.password!==req.body.checkPass){
    res.render('passport/signup', {
      message: 'Las contraseñas no coinsiden, favor de verificar',
      email: req.body.email
    });
  }
  User.register(req.body, req.body.password)
    .then(user=>{
      res.redirect('/login');
    })
    .catch(err=>{
      res.render('passport/signup', {
        message: err,
        email: req.body.email
      });
    });
});

router.get('/login', isLoggedIn, (req,res)=>{
  res.render('passport/login');
});

router.post('/login', passport.authenticate('local'), (req,res)=>{
  res.redirect('/private-page');
});

router.get('/logout', isAuth, (req,res)=>{
  req.logout();
  res.redirect('/login');
});

router.get("/private-page", isAuth, ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;