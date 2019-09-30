const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

// Add passport
const passport = require("../helpers/passport");
const ensureLogin = require("connect-ensure-login");

//SIGNUP ROUTES
passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;
  let error;
  const bcryptSalt = 10;

  if (!username || !password) {
    error = "Should type both: username and password";
    return res.render("passport/signup", { title: "signup", error });
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username }).then(user => {
    if (user) {
      error = `This username: ${username} already exists`;
      return res.render("passport/signup", { title: "signup", error });
    }
    User.create({ username: username, password: hashPass }).then(user => {
      res.redirect("/login");
    });
  });
});

//LOGIN ROUTES
passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info = {}) => {
    const { message: error } = info;
    if (error) {
      res.render("passport/login", { title: "login", error });
    }
    req.login(user, err => {
      res.redirect("/private-page");
    });
  })(req, res);
});

//PRIVATE ROUTES
passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

//LOGOUT
passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;
