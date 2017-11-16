const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/user");

const router = express.Router();
const bcryptSalt = 10;

// PRIVATE
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// LOGIN
router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// Post /logout
router.post("/logout", function(req, res, next) {
  req.logout();
  res.redirect("/");
  // if (req.session) {
  //   // // delete session object
  //   // req.session.destroy(function(err) {
  //   // if (err) {
  //   //   return next(err);
  //   // } else {
  //   //   return res.redirect("/");
  //   // }
  //   // });
  // }
});

// SIGNUP
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

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
        req.login(newUser, function(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    });
  });
});

module.exports = router;
