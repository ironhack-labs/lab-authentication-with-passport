"use strict";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("index", {
      title: "Express",
      loggedIn: true
    });
  } else {
    res.render("index", {
      title: "Express",
      loggedIn: false
    });
  }
});

module.exports = router;
