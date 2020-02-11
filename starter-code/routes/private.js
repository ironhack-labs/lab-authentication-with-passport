const express = require("express");
const { isLoggedIn } = require("../lib/logging");
const router = express.Router();

router.use(isLoggedIn);

//const ensureLogin = require("connect-ensure-login");

/*
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.session.user });
});
*/

module.exports = router;
