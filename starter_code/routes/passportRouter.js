const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");


router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/newUser", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/newUser", {
      error: "Indicate username and password"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/newUser", {
          error: "The username is being used"
        });
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
          res.render("passport/newUser", { error: "Here is an error" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
