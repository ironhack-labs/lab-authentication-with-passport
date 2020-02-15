const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const spotifyAPI = require("../lib/spotify-api");

// get home page
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private");
});

// Spotify top artists endpoint
router.get("/spotify", (req, res, next) => {
  spotifyAPI(req.user.spotifyToken, artists => {
    res.render("index", { artists });
  });
});

module.exports = router;
