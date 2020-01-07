const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport"); 
// const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
})

passportRouter.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

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

    User.create({
      username,
      password: hashPass
    })
    .then(() => {
      res.render("passport/signup", { message: "Account created" });
    })
    .catch(error => {
      console.log(error);
    })
  })
  .catch(error => {
    next(error);
  });
});



// LOG IN ROUTE
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

// LOG IN POST
passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/", 
  failureRedirect: "/login", 
  failureFlash: true, 
  passReqToCallback: true, 
 }));

passportRouter.get("/logout", (req, res) => {
 req.logout();
 res.redirect("/");
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;