const express = require("express");
const router = express.Router();
// TODO: Require user model

const User = require("../models/User.model");
const { request } = require("../app");

const passport = require("passport");

// TODO: Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");

// ------------------------------------------------------------------- //

// TODO: Add the /signup routes (GET and POST)

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: req.flash("error") }); // !!!
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

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  console.log("SESSION =====> ", req.session);
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user; // SESSION
        res.render("auth/private", {
          user: user,
          userInSession: req.session.currentUser,
        });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect("auth/login"); // can't access the page, so go and log in
    return;
  }
  // ok, req.user is defined
  res.render("auth/private", { user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "auth/login",
    failureFlash: true, // !!!
  })
);

router.get("/logout", (req, res, next) => {
  // this is how you log out via passport
  req.logout(function (err) {
    // if there is an error we pass the error to the error handler via next()
    if (err) {
      return next(err);
    }
    // if there is no error we redirect to home (or any other page)
    res.redirect("/");
  });
  res.redirect("/");
});

// router.post("/logout", (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) next(err);
//     res.redirect("/");
//   });
// });

module.exports = router;
