const express = require("express");
const passportRouter = express.Router();
const model = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");

const ensureLogin = require("connect-ensure-login");

// Create: signup or register
passportRouter.get("/signup", isLoggedOut(), (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", isLoggedOut(), async (req, res, next) => {
  const { username, password, name, lastname, year, country } = req.body;
  const existingUser = await model.findOne({ username });
  if (!existingUser) {
    const newUser = await model.create({
      username,
      password: hashPassword(password)
    });
    res.redirect("/login");
  } else {
    res.render("passport/signup");
  }
});

// Create: login
passportRouter.get("/login", isLoggedOut(), (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  isLoggedOut(),
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);

passportRouter.get("/logout", isLoggedIn(), async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get("/private", isLoggedIn(), (req, res, next) => {
  res.render("passport/private");
});

// passportRouter.get(
//   "/private-page",
//   ensureLogin.ensureLoggedIn(),
//   (req, res) => {
//     res.render("passport/private", { user: req.user });
//   }
// );

module.exports = passportRouter;
