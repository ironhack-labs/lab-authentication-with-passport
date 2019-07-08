const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res, next) => {
  res.render('../views/passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  
  User.find({username: username})
  .then((user) => {
    if(user) {
      res.render('../views/passport/signup', {message: "Usuário já cadastrado!"});
      return;
    }
    
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    
    User.create({username: username, password: hash})
    .then(() => {
    res.render('../views/passport/login')
  })
    .catch(err => console.log(err));
  })
});

passportRouter.get("/login", (req, res, next) => {
  res.render("../views/passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("../views/passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;