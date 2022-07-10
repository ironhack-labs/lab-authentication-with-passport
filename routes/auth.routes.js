const express = require("express");
const router = express.Router();
// TODO: Require user model

const User = require("../models/User.model");
const { request } = require("../app");

const passport = require("passport");

// TODO: Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");

// ------------------------------------------------------------------- //

///////////////////////////////////////////////////////////////////////
//////////////////////////// GITHUB ///////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/private-page",
    failureRedirect: "/signup",
  })
);

///////////////////////////////////////////////////////////////////////
/////////////////////////// SIGN UP ///////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  // is the password 4+ characters
  if (password.length < 4) {
    res.render("auth/signup", {
      message: "Your password has to be 4 chars min",
    });
    return;
  }
  // is the username not empty
  if (username.length === 0) {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }
  // validation passed
  User.findOne({ username: username }).then((userFromDB) => {
    // if there is a user
    console.log(userFromDB);
    if (userFromDB !== null) {
      res.render("auth/signup", { message: "Your username is already taken" });
      return;
    } else {
      // we hash the password
      const salt = bcrypt.genSaltSync(10);
      console.log(salt);
      const hash = bcrypt.hashSync(password, salt);
      // create the user
      User.create({
        username: username,
        password: hash,
      })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect("/");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

///////////////////////////////////////////////////////////////////////
/////////////////////////// PRIVATE PAGE //////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect("/login"); // can't access the page, so go and log in
    return;
  }
  // ok, req.user is defined
  res.render("auth/private", { user: req.user });
});

///////////////////////////////////////////////////////////////////////
/////////////////////////// LOGIN /////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// router.get("/login", (req, res, next) => {
//   res.render("auth/login");
// });

router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: req.flash("error") }); // !!!
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true, // !!!
  })
);

///////////////////////////////////////////////////////////////////////
/////////////////////////// LOG OUT ///////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
