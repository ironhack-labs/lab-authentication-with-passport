const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
// Add passport
const passport = require("passport");
const flash = require("connect-flash")

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/signup", (req, res) => res.render("passport/signup"))

passportRouter.post("/signup", (req, res, next) => {
 const username = req.body.username;
 const password = req.body.password;

 User.findOne({ "username": username })
     .then(user => {
         if (user !== null) {
             res.render("auth/signup", {
                 errorMsg: "The username already exists!"
             })
         return
     }

     const salt     = bcrypt.genSaltSync(bcryptSalt);
     const hashPass = bcrypt.hashSync(password, salt);

     User.create({username, password: hashPass})
         .then(()        => res.redirect("/"))
         .catch(error    => console.log(error))
 })
})
passportRouter.get("/login", (req, res) => res.render("passport/login", { "message": req.flash("error") }))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
 res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;