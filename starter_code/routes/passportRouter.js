const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
const passport      = require("passport");

function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    console.log(req.user)
    return next()
  }else{
    res.redirect('/login')
  }
};

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/private-page')
  }else{
    next();
  }
};

router.get("/private-page", isAuthenticated, (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/login', isLoggedIn ,(req,res)=>{
  res.render('passport/login')
})

router.post('/login', passport.authenticate('local') ,(req,res,next)=>{
  res.redirect('/private-page')
})

router.get('/signup', (req,res)=>{
  res.render('passport/signup')
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(e=>next(e))
})




module.exports = router;