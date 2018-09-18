const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


//RUTA para signup




router.get("/signup",(req,res,next)=>{
  res.render("../views/passport/signup.hbs")
})
router.post("/signup",(req,res,next)=>{
  User.register(req.body,req.body.password)
    .then(user =>{
      res.redirect("/login")
    })
    .catch(e=>next(e))
})

//Ruta para Login



router.get("/login",(req,res,next)=>{
  res.render("passport/login.hbs")
})
router.post("/login",passport.authenticate("local"), (req,res,next)=>{
  res.redirect("/private-page")
})



module.exports = router;
