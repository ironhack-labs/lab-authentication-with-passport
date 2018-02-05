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
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // bcrypt.genSalt(saltRounds, (err, salt) => {
  //   if (err) return next(err);
  //   bcrypt.hash(password, salt, (err, hash) => {
  //     if (err) return next(err);

  //     const user = new User({
  //       username,
  //       password: hash
  //     });
  //     user.save(err => {
  //       if (err) return next(err);
  //       res.redirect("/login");
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
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
    newUser.save(err => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.render("passport/login", {
      errors: "please enter a valid username and password"
    });
  }
  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      return res.render("passport/login", {
        errors: "the username doesnt exist"
      });
    }
    bcrypt.compare(password, user.password, (err, areTheSame) => {
      if (err) return next(err);
      if (areTheSame) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("passport/login", { errors: "invalid password" });
      }
    });
  });
});

module.exports = router;

/*
GET /
GET /private-page
GET / signup
POST / signup
GET login
*/
