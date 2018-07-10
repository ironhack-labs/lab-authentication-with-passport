const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

function isAuthenticated(req,res,next){
  if (req.isAuthenticated()){
      return next()
  }else{
      res.redirect("/login");
  }
}

function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
      res.redirect("/private");
  }else{
      next();
  }
}

router.get("/logout", (req,res,next)=>{
  req.logout();
  res.redirect("/login");
})

router.get("/private", isAuthenticated, (req,res)=>{
  res.render("./passport/private");
})

router.post("/login", passport.authenticate("local"),(req,res,next)=>{
  res.redirect("/private")
})

router.get("/login", isLoggedIn, (req,res)=>{
  res.render('./passport/login');
})

router.post("/signup",(req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>res.redirect("/login"))
  .catch(e=>next(e))
})

router.get("/signup", (req,res)=>{
  res.render('./passport/signup');
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports=router;