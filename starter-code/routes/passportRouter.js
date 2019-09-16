const express = require("express");
// const passportRouter = express.Router();
// Require user model
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
// Add bcrypt to encrypt passwords
// Add passport

const passportRouter = express.Router();
const bcryptSalt = 9;

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Please indicate username and password"
    });
  }
  User.findOne({ username }).then(user => {
    if (user) {
      res.render("passport/signup", { message: "username already exist" });
    } 
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User ({
      username, 
      password:hashPass,
    });
    newUser.save()
    .then(() => res.redirect("/"))
    .catch(error => next(error));
  })
  .catch(error => next(error));
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/login', passport.authenticate('local-auth', {
  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));


passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
