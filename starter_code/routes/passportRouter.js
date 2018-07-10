const express        = require("express");
const router         = express.Router();
// User model
const User = require('../models/User');
// Bcrypt to encrypt passwords
const passport      = require("passport");

function isAuthenticated(req,res,next){
  if(req.isAuthenticated){
    return next()
  } else {
    res.redirect('/login');
  }
}

function isLoggedIn(req,res,next){
  if(req.session.currentUser){
    res.redirect('/private')
  } else{
    next();
  }
}

router.get('/signup', (req,res)=>{
  res.render('passport/signup')
})

router.post('/signup',(req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(users=>res.redirect('/login'))
  .catch(e=>next(e));
})

router.get('/login', isLoggedIn, (req,res)=>{
  res.render('passport/login')
})

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  res.redirect('/private')
})

router.get('/private', isAuthenticated, (req,res)=>{
  res.render('passport/private');
})

module.exports = router;