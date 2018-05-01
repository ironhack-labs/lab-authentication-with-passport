const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("../passport");







router.get("/signup",(req,res)=>{
  res.render("passport/signup")
})

router.post("/signup",(req,res)=>{
 
    bcrypt.genSalt(10,(err,salt)=>{
      req.body.password = bcrypt.hashSync(req.body.password,salt);
      
        User.create(req.body)
        .then(r=>{
        res.redirect("/login")
        })
        .catch(e=>{
        console.log(e);
        })
    
    })
  })

router.get("/login",(req,res)=>{
  res.render("passport/login")

})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;