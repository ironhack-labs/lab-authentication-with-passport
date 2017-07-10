const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  console.log("rendersignup");
  res.render("passport/signup");
});

authRoutes.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
console.log("redirect");
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          message: "Something went wrong"
        });
      } else {

        res.redirect("/");
      }
    });
  });
});
authRoutes.get("/login", (req, res, next) => {
  res.render("passport/login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = authRoutes;
