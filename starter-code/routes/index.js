const express = require("express");
const router = express.Router();
const test = require("./passportRouter");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
