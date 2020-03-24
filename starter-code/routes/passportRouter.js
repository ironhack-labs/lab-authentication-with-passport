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
  console.log('works'+ JSON.stringify(req.body))
  const { username, password } = req.body;
      bcrypt.hash(password, 10).then(hash => {
        User.create({
          username: username,
          password: hash
        }).then(user => {
          console.log(username)
          res.render("passport/private", { user });
        });
      });
    });



passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});
passportRouter.post("/login",
  passport.authenticate("local", {
    successRedirect: "passport/private",
    failureRedirect: "passport/login",
    failureFlash: true
  })
);

module.exports = passportRouter;

