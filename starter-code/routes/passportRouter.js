const express        = require("express");
const passportRouter = express.Router();
// Require user model
const  User = require('../models/user');
// Add bcrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const bcryptSalt = 10;
// Add passport 
const passport = require("../helpers/passport");

const ensureLogin = require("connect-ensure-login");

// Sign Up
passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  // Username or password empty
  if(!username || !password) {
    res.render('passport/signup', { message: 'Indicate username and password' });
    return;
  }

  // Username already exists
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcryptjs.genSaltSync(bcryptSalt);
    const hashPass = bcryptjs.hashSync(password, salt);

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

// Log In
passportRouter.get('/login', (req, res) => {
  res.render('passport/login');
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;