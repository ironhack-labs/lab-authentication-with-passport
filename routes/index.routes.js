// jshint esversion:6

const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res) => res.render("index.hbs"));

module.exports = router;
