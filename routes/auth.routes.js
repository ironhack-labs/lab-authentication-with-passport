const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Endpoints
router.get("/sign-up", (req, res) => res.render("sign-up"));
router.post("/sign-up", (req, res, next) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.render("sign-up", { message: "Escribe tu nombre y contraseña" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render("sign-up", { message: "Este username ya existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(() => res.redirect("/"))
        .catch((error) => next(error));
    })
    .catch((error) => next(error)); 
});

// Signup
router.get("/log-in", (req, res, next) =>
    res.render("log-in", { "message": req.flash("error") }
    )
);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/log-in",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Signup






module.exports = router;
