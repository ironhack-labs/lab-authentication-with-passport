const express = require("express");
const passportRouter = express.Router();
const {
  getSignup,
  postSignup,
  getLogin
} = require("../controllers/auth.controllers");
const passport = require("../middlewares/passport");
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);
passportRouter.get("/signup", getSignup);
passportRouter.post("/signup", postSignup);
passportRouter.get("/login", getLogin);
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);
module.exports = passportRouter;
