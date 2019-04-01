const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
// Add passport 
const passport = require("passport")


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/signup" , (req, res) => {
  res.render("passport/signup")
})



passportRouter.post("/signup",(req,res) => {
  let {username, email, password} = req.body;

  User.register({email,username} , password)
  .then(user => {
    res.redirect("/login")
  })
  .catch(err => {console.log(err)})
});

passportRouter.get("/login",(req, res) =>{
  res.render("passport/login" )
});

passportRouter.post(
  "/login",
    passport.authenticate("local",{
      successRedirect:"/private-page",
      failureRedirect:"/login",
      failureFlash: "Invalid email or password"
    })
);

passportRouter.get("/logout" ,(req,res) => {
  req.logout();
  res.redirect("/login")
})

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;