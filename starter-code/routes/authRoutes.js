var express = require('express');
const passport      = require("passport");
var router = express.Router();
const ensureLogin = require("connect-ensure-login");
//const authRoutes = express.authRoutes();

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
module.exports = router;
