const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get('/signup',(req,res)=>{
  res.render('../views/passport/signup.hbs')
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body,req.body.password)
  .then(user=>{
  res.redirect('/login')
  })
  .catch(error=>next(error))
  })

router.get('/login',(req,res,next)=>{
  res.render('../views/passport/login.hbs')
})  

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  res.redirect('/profile')
  })
  

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
