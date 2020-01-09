const express        = require("express");
const passportRouter = express.Router();
// TODO: Require user model
const User = require("../models/user");
const passport = require('passport')

// TODO: Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// TODO: Add the /signup routes (GET and POST)
passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});
passportRouter.post('/signup', (req, res) => {
  const {username, password} = req.body;

  // 1. Check username and password are not empty
  if (username === "" || password === "") {
    res.render("passport/signup", { errorMessage: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      // 2. Check user does not already exist
      if (user) {
        res.render("passport/signup", { errorMessage: "The username already exists" });
        return;
      }

      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      //
      // Save the user in DB
      //

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(user => res.redirect("/"))
        .catch(err => next(err))
      ;
        
    })
    .catch(err => next(err))
  ;
});

passportRouter.get('/login', (req, res) => {
  res.render('passport/login', { "errorMessage": req.flash("error") });
});
passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

passportRouter.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;
