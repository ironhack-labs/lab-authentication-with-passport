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
})
.get("/signup",(req, res, next)=>{
  res.render("passport/signup");
})
.post("/signup", (req, res, next)=>{
  console.log(req.body);
  User.register(new User({ username : req.body.username }), 
  req.body.password, 
  function(err, account) {
    if (err) {
        return res.json(err);
    }
    return res.redirect("/login")
      });
})
.get("/login", (req, res, next)=>{
  return res.render("passport/login");
})
.post("/login",
passport.authenticate('local'),
  (req, res, next)=>{
  return res.redirect("/");
});








module.exports = router;
