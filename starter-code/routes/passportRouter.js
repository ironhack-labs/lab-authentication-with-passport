/*jshint esversion: 6*/

const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

//Private-page
router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("hola");
  res.render("passport/private", { user: req.user });
});

//Signup-page
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

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


//Login-page
router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


//Logout-page
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


//Export module
module.exports = router;
