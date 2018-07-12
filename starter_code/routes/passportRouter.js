const express        = require("express");
const router         = express.Router();
const ensureLogin    = require("connect-ensure-login");
const User           = require("../models/user");
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
const passport       = require("passport");
const mongoose       = require("mongoose");
//========================>
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const flash         = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
//========================>

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//========================>
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

  User.findOne({ username })
  .then(responseFromDB => {
    if (responseFromDB !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt      = bcrypt.genSaltSync(bcryptSalt);
    const hashPass  = bcrypt.hashSync(password, salt);

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
  })
  .catch(error => {
    next(error)
  })
});

//========================>

router.get("/login", (req, res, next) => {
  res.render("passport/login", {'message': req.flash("error") });
});     

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
//========================>
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});
//========================>
module.exports = router;





