/*jshint esversion: 6*/
const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require("connect-flash");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup.ejs");
});
router.post("/signup", (req, res, next)=> {
  var username = req.body.username;
  var password = req.body.password;

 if (username === "" || password === "") {
   res.render("passport/signup", { message: "Indicate username and password" });
   return;
 }

 User.findOne({ username }, "username", (err, user) => {
   if (user !== null) {
     res.render("passport/signup", { message: "The username already exists" });
     return;
   }

   var salt     = bcrypt.genSaltSync(bcryptSalt);
   var hashPass = bcrypt.hashSync(password, salt);

   var newUser = User({
     username,
     password: hashPass
   });

   newUser.save((err) => {
     if (err) {
       res.render("passport/signup", { message: "The username already exists" });
     } else {
       res.redirect("/login");
     }
   });
 });
});

router.get("/login", (req, res) => {
  res.render("passport/login.ejs", { "message": req.flash("error") });
  // res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
 successRedirect: "/private-page",
 failureRedirect: "/signup",
 failureFlash: true,
 passReqToCallback: true
}));



module.exports = router;
