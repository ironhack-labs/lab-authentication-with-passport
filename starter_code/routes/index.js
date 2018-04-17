const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

router.get("/", (req, res, next) => {

  res.render("index", { user: req.user });
});

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
