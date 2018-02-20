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

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // validation to make sure boxes have info in them
if (username === "" || password === "") {
  res.render("passport/signup", { message: "Indicate username and password" });
  return;
}

// validation2 checks to make sure username doesn't already exist
User.findOne({ username }, "username", (err, user) => {
  if (user !== null) {
  res.render("passport/signup", { message: "The username already exists" });
  return;
  }

// encrypt password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

// generate new user with encrypted password
  const newUser = new User({
      username,
      password: hashPass
  });
// save new user to the database
  newUser.save((err) => {
  if (err) {
      res.render("passport/signup", { message: "Something went wrong" });
  } else {
      res.redirect("/");
  }
  });
});
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });;
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});



module.exports = router;
