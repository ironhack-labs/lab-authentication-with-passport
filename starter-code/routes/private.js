const express = require("express");
const { isLoggedIn } = require("../lib/logging");
const router = express.Router();

router.use(isLoggedIn);

router.get("/", (req, res, next) => {
  if (req.session.currentUser) return res.render("private/private");
  res.redirect("auth/login");
});

module.exports = router;
