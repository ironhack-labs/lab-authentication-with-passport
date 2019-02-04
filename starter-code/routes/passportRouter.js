const express        = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const bcryptSalt = 10;

// Require user model

// Add bcrypt to encrypt passwords

// Add passport 





passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");

});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
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


passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  // Thanks to passport, when we are connected, req.user is defined 
  // and req.user is equal to the connected user
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = passportRouter;