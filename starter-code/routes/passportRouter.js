const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/User");
// Add bcrypt to encrypt passwords
const { hashPassword, checkHashed } = require("../lib/hashing");
// Add passport
const passport = require("passport");
// Add LoggedIn Middleware
const ensureLogin = require("connect-ensure-login");
const strength = require("strength");

router.get("/register", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("passport/register");
});

router.post(
  "/register",
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      req.flash("error", "Indicate an username and password to signup");
      return res.redirect("/auth/register");
    } else {
      try {
        const existingUser = await User.findOne({ username });
        if (!existingUser && strength(password) >= 3) {
          const newUser = await User.create({
            username,
            password: hashPassword(password)
          });
          console.log(strength(password));
          return res.redirect("/");
        } else if (strength(password) < 3) {
          req.flash(
            "error",
            "Create a password with mixed case, special character and number (minimun 8 characters and no repeated letters)"
          );
          return res.redirect("/auth/register");
        } else {
          req.flash("error", "The user already exists");
          return res.redirect("/auth/register");
        }
      } catch (e) {
        next(e);
      }
    }
  }
);

router.get("/login", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  ensureLogin.ensureLoggedOut(),
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Incorret username or password"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

/* intenté crear una autenticacion manual para hacer un mejor handling de los mensajes de flash pero no he dado con la solucion 
router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (!user) {
      if (err) {
        req.flash("error", err);
        return res.redirect("/auth/login");
      }
      return res.redirect("/auth/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});
*/

router.get(
  "/logout",
  ensureLogin.ensureLoggedIn("/auth/login"),
  async (req, res, next) => {
    req.logout();
    res.redirect("/");
  }
);

router.get(
  "/private-page",
  ensureLogin.ensureLoggedIn("/auth/login"),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = router;
