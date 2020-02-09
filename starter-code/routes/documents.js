const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/isLogged");

router.get("/", isLoggedIn(), (req, res) => {
  res.render("auth/documents");
});

module.exports = router;
