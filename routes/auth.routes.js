const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => res.render("auth/signup"));
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", {
      message: "Indicate username and password",
    });
    return;
  }
  User.findOne({
    username,
  })
    .then((user) => {
      if (user) {
        res.render("auth/signup", {
          messae: "Username already exist",
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username,
        password: hashPass,
      })
        .then(() => res.redirect("/"))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res, next) =>
  res.render("auth/login", {
    message: req.flash("error"),
  })
);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.render("auth/login", { message: "Sesión cerrada" });
});

module.exports = router;
