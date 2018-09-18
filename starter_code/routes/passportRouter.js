const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


// const isLogged = (req,res,next) => {
//   if (req.isAuthenticated()){
//     return next()
//   } else {
//     res.redirect('/passport/login')
//   }
// }

router.get ('/signup',(req,res,next)=>{
  res.render ('passport/signup')
})

router.post ('/signup',(req,res,next)=>{
  User.register(req.body,req.body.password)
  .then (user=>{
    res.redirect('/passport/login')
  })
  .catch(error=>next(error))
})

router.get ('/login', (req,res,next)=>{
  res.render('passport/login')
})

router.post ('/login', passport.authenticate('local'),(req,res,next)=>{
  res.redirect('passport/profile')
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = router;




