const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log(req.user)
        return next()
    }else{
        res.redirect('/login');
    }
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/private')
    }else{
        next();
    }
}

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});


router.post('/signup', (req,res,next)=>{

  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(e=>next(e));
})


router.get('/login', isLoggedIn, (req,res)=>{
  res.render('passport/login')
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{

  res.redirect('/private');
});



module.exports = router;