const express = require("express");
const ensureLogin = require("connect-ensure-login");
const router = express.Router();

router.get("/", ensureLogin.ensureLoggedIn("/auth/login"), (req, res) => {
  res.render("private/private", { user: req.user });
});

module.exports = router;
