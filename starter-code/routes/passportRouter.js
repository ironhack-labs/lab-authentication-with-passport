const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const User = require("../models/user");
  const bcrypt = require("bcrypt");
  const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

// Require user model
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup.hbs');
});
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

// Add bcrypt to encrypt passwords
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
      res.render("auth/signup", { message: "The username already exists" });
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
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



// Add passport 
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login.hbs');
});
passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = passportRouter;