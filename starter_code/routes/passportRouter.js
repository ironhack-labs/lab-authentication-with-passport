const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
        // req.user
    return next()
  }else {
    res.redirect("/login")
  }
};

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    res.redirect("/private-page")
  }else{
    next();
  }
};

router.get("/logout",(req,res)=>{
  req.logout();
  res.render("/");
});


router.get("/private",isAuthenticated,(req,res)=>{
    res.send("You made it here");
});


router.get("/login",isLoggedIn,(req,res,next)=>{
    res.render("passport/login");
});

router.post("/login",passport.authenticate('local'),(req,res,next)=>{
  res.redirect('/private-page');
});

router.get("/signup",(req,res)=>{
    res.render("passport/signup");
});
router.post("/signup",(req,res,next)=>{
  User.register(req.body,req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(e=>next(e));
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;