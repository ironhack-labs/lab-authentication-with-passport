const express = require("express");
const passportRouter = express.Router();
const passport = require("../config/passport");

// Require User model
const User = require("../models/User");

// Signup Route
passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  User.register({ email }, password)
    .then(user => res.redirect("/private-page"))
    .catch(err => {
      if (err.name === "UserExistsError") {
        return res.render("passport/signup", {
          error: "The user is already registered"
        });
      }
    });
});

// Login Route
passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("passport/login", {
        error: "Could not find the combination of user and password"
      });
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect(`/private-page`);
    });
  })(req, res, next);
});

// Logout Route
passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get("/private-page", ensureLogin, (req, res) => {
  res.render("passport/private", { user: req.user });
});

function ensureLogin(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect("/login");
}

module.exports = passportRouter;
