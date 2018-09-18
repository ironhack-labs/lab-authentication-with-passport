const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

//signup
router.get('/signup',(req,res,next)=>{
  res.render('passport/signup')
})

router.post('/signup',(req,res,next)=>{
  User.register(req.body,req.body.password)
  .then(user=>{
    res.redirect('/login')
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/login',(req,res,next)=>{
  res.render('passport/login')
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  console.log(req.user)
  res.redirect('/private-page')
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})


module.exports = router;
