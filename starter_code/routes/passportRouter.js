// routes/auth-routes.js
const express = require("express");
const passport = require("passport");
const passportRouter = express.Router();

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


passportRouter.get("/signup", (req, res, next) => {
  res.render("pass/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("pass/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("pass/signup", { message: "The username already exists" });
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
        res.render("pass/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("pass/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/pass/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = passportRouter;



