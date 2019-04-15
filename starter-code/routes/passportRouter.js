const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');

const flash = require("connect-flash"); 
const bcrypt= require('bcrypt'); 
const passport = require('passport'); 
const passportLocal = require('passport-local').Strategy; 
const expressSession = require('express-session');

const ensureLogin = require("connect-ensure-login");


passportRouter.use(expressSession({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passportRouter.use(flash());

passport.use(new passportLocal((username, password, next) => {
   User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('No user');
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log('Bad password');
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


passportRouter.use(passport.initialize());
passportRouter.use(passport.session());


passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup", { user: req.user });
});

passportRouter.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
 
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

    const salt = bcrypt.genSaltSync(10);
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
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/login", (req, res) => {
  //res.render("passport/login", { user: req.user });
  res.render("passport/login", { "message": req.flash("error") });
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;

