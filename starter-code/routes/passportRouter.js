const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page",ensureLogin.ensureLoggedIn(),(req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});
passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;


User.findOne({
  username
})
  .then(data => {
    if (data !== null) {
      throw new Error("Username already exists");
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hashPass });

    return newUser.save();
  })
  .then(data => {
    res.redirect("/");
  })
  .catch(err => {
    res.render("passport/signup", {
      errorMessage: err.message
    });
  });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});
passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))
passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user);
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/error', (req, res, next) => {
  res.render('error',{ message: 'There is already a user with this name in the database.' });
})

module.exports = passportRouter;
