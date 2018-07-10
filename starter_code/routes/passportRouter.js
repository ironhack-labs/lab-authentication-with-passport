const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup', (req, res, next)=>{
  res.render('passport/signup');
})

router.post('/signup',(req,res,next)=>{

  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(e=>next(e))
})

router.get('/login', (req, res, next)=>{
  res.render('passport/login');
})


module.exports = router