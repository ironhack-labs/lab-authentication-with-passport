const express = require("express");
const passportRouter = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require('../models/user')

const passport = require('passport')

const ensureLogin = require("connect-ensure-login");

// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('passport/signup', { message: 'Indicate username and password' })
    return;
  }
  User.findOne({ username }).then(user => {
    if (user !== null) {
      res.render('passport/signup', { message: 'Username already exists :(' })
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    })
    newUser.save((err) => {
      if (err) {
        res.render('/signup', { message: 'Something went wrong' })
      } else {
        res.redirect('/')
      }
    })
  })
    .catch(error => {
      next(error)
    })

})

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private", ensureLogin.ensureLoggedIn('/passport/login'), (req, res) => {
  res.render("private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = passportRouter;