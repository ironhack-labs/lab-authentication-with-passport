const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");

//router sigunp passport GET
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});
//router signup passport POST
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass
      });
      return newUser.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      res.render("passport/signup", { message: "Something went wrong" });
    });
});
//LOGIN
router.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);
//LOGOUT
router.get("/logout", (req, res, text) => {
  req.logOut();
  return res.redirect("/");
});
//PRIVATE-PAGE
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
//always export with router const(line7)
module.exports = router;
