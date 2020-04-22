const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

router.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (request, response) => {
    response.render("auth/private", { user: request.user });
  }
);

// Iteration 1:

router.get("/signup", (request, response) => {
  response.render("auth/signup");
});

router.post("/signup", (request, response, next) => {
  const { username, password } = request.body;
  if (username === "" || password === "") {
    response.render("auth/signup", {
      message: "Indicate username and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        response.render("auth/signup", {
          message: "The username already exists",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
      });

      newUser.save((error) => {
        if (error) {
          response.render("auth/signup", { message: "Something went wrong" });
        } else {
          response.redirect("/");
        }
      });
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});

// Iteration 2:

router.get("/login", (request, response) => {
  response.render("auth/login", { message: request.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Bonus: Social Login

router.get("/auth/slack", passport.authenticate("slack"));
router.get(
  "/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/private-page",
    failureRedirect: "/", // here you would navigate to the classic login page
  })
);

module.exports = router;
