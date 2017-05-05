const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
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
  let username = req.body.username;
  let password = req.body.password;

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

router.get("/login", (req, res, next) => {
    res.render("passport/login", { "message": req.flash("error") })
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

module.exports = router;
