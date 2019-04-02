const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const bcrypt = require('bcrypt');

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcryptSalt = 10;

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user : req.user });
});

//signup
passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("/auth/signup", { message: "The username already exists" });
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
        res.render("/auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/auth/login");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//login
passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("private", { user: req.user });
// });
module.exports = passportRouter;