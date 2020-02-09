const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLogged");

router.get("/", (req, res) => {
  res.render("auth/login", { login: true });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.get("/o", isLoggedIn(), async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
