const express = require("express");
const router = express.Router();
// User model
const UserModel = require("../models/UserModel");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//*****************  #1 - The Sign Up Feature *********
//GET for signup page
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  //captures username and password from body
  const username = req.body.username;
  const password = req.body.password;

  //applies encryption (using salt method) to password - standard, don't change

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //finally creates new user and add to Model/databse
  //use Model.create()

  //create new user object with entered username and encrypted password
  const newUserObject = {
    username: username,
    password: hashPass
  };

  // if neither password nor username is entered, then render error
  if (
    !username ||
    !password ||
    username === null ||
    password === null ||
    username === "" ||
    password === ""
  ) {
    res.render("passport/signup", {
      errorMessage: "Enter username and a password for signup"
    });
  }

  // search if username already exists, elses render error

  UserModel.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      // if username does not exist, create new Model
      UserModel.create(newUserObject)
        .then(createdUser => {
          console.log("User was successfully created");
          res.redirect("/");
        })
        .catch(err => {
          console.log(
            "User could not be created because username already exists"
          );
        });
    })
    .catch(err => {
      console.log("Fields are required.");
    });
});

//*****************  #2 - The Login Feature *********

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

//*****************  #3 - The Login Feature *********

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
