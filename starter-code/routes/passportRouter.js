const express = require("express");
const passportRouter = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.post('/signup', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('passport/signup', {message: 'Indicate username please.'});
    return;
  }

  User.findOne({username})
  .then(user => {
    if (user !== null) {
      res.render('passport/signup', {message: 'This user already exists.'})
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      password: hashPass,
    })

    newUser.save((err) => {
      if (err) {
        res.render('passport/signup', {message: 'Something went wrong'})
      } else {
        res.redirect('/login');
      }
    })

  })
  
  

})

passportRouter.get(
  "/login",
  (req, res) => {
    res.render("passport/login", { "message": req.flash("error") });
  }
);

passportRouter.post(
  "/login", passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
  })
  
);

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);



module.exports = passportRouter;
