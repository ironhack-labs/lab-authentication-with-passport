const express = require("express");
const passportRouter = express.Router();
const {
  getSignup,
  postSignup,
  getLogin
} = require("../controllers/authController");
const passport = require("../middlewares/passport");
const { ensureLoggedIn } = require("connect-ensure-login");
// Require user model

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
// Add bcrypt to encrypt passwords
passportRouter.get(
  "/private-page",
  ensureLoggedIn({
    redirectTo: "/login"
  }),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);
// Add passport

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
