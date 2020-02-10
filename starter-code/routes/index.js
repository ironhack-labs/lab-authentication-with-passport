const express = require("express");
const auth = require("./auth");
const private = require("./private");
const { isLoggedIn } = require("../lib/logging");

const router = express.Router();

router.use("/auth", auth);
router.use("/private", private);

router.get("/", isLoggedIn(), (req, res, next) => {
  return res.render("home", { user: req.session.user });
});

module.exports = router;
