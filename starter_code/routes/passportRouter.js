const express = require("express");
const authRouter = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


authRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});


authRouter.post("/signup", (req, res, next) => {

  // Take the username and password from request
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password are empty
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  // Check if username already exists
  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        message: "The username already exists!"
      });
      return;
    }

    // ELSE --> Create password hashes:
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          message: "Something went wrong (DB error)"
        });
      } else {
        res.redirect("/");
      }
    });
  });
});


authRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});


authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


module.exports = authRouter;