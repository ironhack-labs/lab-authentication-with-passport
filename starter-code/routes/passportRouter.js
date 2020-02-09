const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res, next) => {
  const {username, password} = req.body;

  try {
    const existingUSer = await User.findOne({username});
    console.log(existingUSer);

    if(!existingUSer) {
      // Form validation
      if(username === "" || password === "") {
      console.log(`Invalid form`);
      return res.render("passport/signup");
      }

      // Generate hash
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // Create new user
      const newUser = await User.create({username, password: hashPass });
      console.log(`New user created ${newUser}`);
      return res.redirect("/");  

    } else {
      console.log("Usuario existente");
      return res.render("passport/signup");
    }
  } catch (error) {
    console.log(`Error creating new user ${error}`);
    return res.render("passport/signup");
  }
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", {message: req.flash("error")});
});

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
  }
);



module.exports = passportRouter;
