const express        = require("express");
const authRoutes     = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const logout         = require('express-passport-logout');



authRoutes.get("/signup", (req, res, next) => {
 res.render("passport/signup");
});

authRoutes.post("/signup", (req, res, next) => {
 const username = req.body.username;
 const password = req.body.password;

 if (username === "" || password === "") {
   res.render("passport/signup", { message: "Indicate username and password" });
   return;
 }

 User.findOne({ username }, "username", (err, user) => {
   if (user !== null) {
     res.render("passport/signup", { message: "The username already exists" });
     return;
   }

   const salt     = bcrypt.genSaltSync(bcryptSalt);
   const hashPass = bcrypt.hashSync(password, salt);

   const newUser = User({
     username: username,
     password: hashPass
   });

   newUser.save((err) => {
     if (err) {
       res.render("passport/signup", { message: "Something went wrong" });
     } else {
       res.redirect("/");
     }
   });
 });
});

authRoutes.get("/login", (req,res,next) => {
  console.log(req.session);
  res.render('passport/login');
} )

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect:"/private-page",
  failureRedirect:"/login",
  failureFlash: true,
  passReqToCallback:false
}) )


authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = authRoutes;
