const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {

  res.render("passport/signup")
})
router.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      console.log(user)
      console.log(user !== null)
      if (user !== null){
        res.render("passport/signup",{message:"The username is already in use"})
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hassPass = bcrypt.hashSync(password,salt)

      User.create({username,password:hassPass})
        .then(()=>{
          res.redirect("/")
        })
        .catch(e=>{
          res.render("passport/signup",{message:"Something went wrong in create: " +e})
        })
    })
    .catch(e=>{
      res.render("passport/signup",{message:"Something went wrong in find user: "+e})
    })
})

router.get("/login", (req,res,next)=>{
  res.render("passport/login")
})
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;
