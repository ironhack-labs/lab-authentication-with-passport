/* jshint esversion: 6 */
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
// *************************   SIGNUP ******************
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if( username === "" || password === ""){
    res.render("passport/signup", {
      errorMessage: "Username or Password are empty !!"
    });
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

// ***************** LOGIN  ***********************

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = router;
