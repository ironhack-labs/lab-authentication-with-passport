const express        = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");




// PRIVATE PAGE ROUTE
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("ok")
  res.render("passport/private", { user: req.user });
});


// SIGNUP ROUTE

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
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

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});





// LOGIN ROUTE

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = passportRouter;