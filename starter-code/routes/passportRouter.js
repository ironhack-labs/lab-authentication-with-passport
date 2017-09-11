const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



//Iteration #1: The Sign-up Feature

//1. Add a new route to your passportRouter.js file with the path/signup
//and point it to your views/passport/signup.ejs file.
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});


//1.3 Finally, add a post route to your passportRoute
//to receive the data from the signup form
//and create a new user with the data.
router.post("/signup", (req, res, next) => {
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
const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
const newUser = new User({
      username,
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


//get: no secret! Load the view to use.
//redefine get method to send errors to the view
router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});
//post: contains Passport functionality.
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
 }));


//LOGIN adding route ensureLogin
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('session:', req.session);
  res.render("passport/private", { user: req.user });
});

//ADDING: Logout Session
router.get("/logout", (req, res) => {
req.logout();
console.log('session:', req.session);
  res.redirect("/login");
});




module.exports = router;
