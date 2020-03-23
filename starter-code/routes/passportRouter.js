const express        = require("express");
const passportRouter = express.Router();
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const ensureLogin    = require("connect-ensure-login");


passportRouter.get("/private" , ensureLogin.ensureLoggedIn(), (req,res,next) =>{
  res.render("passport/private", {user:req.user})
})

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  

  bcrypt.hash(password, 10).then(hash => {
    return User.create({
      username: username,
      password: hash
    }).then(user => {
      console.log({username})
      res.redirect("/");
    });
  });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});
passportRouter.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: true
  })
);

module.exports = passportRouter;

