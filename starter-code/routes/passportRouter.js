const express = require("express");
const passportRouter = express.Router();
const passport = require("../middleware/passport");
const {
  getSignUp,
  postSignUp,
  getLogin
} = require("../controllers/passportControllers");
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

passportRouter.get("/signup", getSignUp);
passportRouter.post("/signup", postSignUp);

passportRouter.get("/login", getLogin);

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = passportRouter;
