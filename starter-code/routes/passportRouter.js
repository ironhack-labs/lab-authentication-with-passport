const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get("/signup", (req, res) => {
  res.render("passport/signup", { user: req.user });
});

router.post("/signup", (req, res, next) => {

});


router.get("/login", (req, res, next) => {
  res.render("passport/login", {});  // req.flash('error') -> 'error' viene predefinido en req.flash
});

// Mandamos un post a passport.authentication y será el que hará la autenticación y redirecciones
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,   // Si utilizas connect flash
  passReqToCallback: true
}));








router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});






module.exports = router;
