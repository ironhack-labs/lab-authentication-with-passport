const express        = require("express");

const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});



// Ahora vamos a hacer los post:

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let bcryptSalt = 10;

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

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true
}) ,(req, res) => {});

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('Esta madre tiene que leerse')
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;