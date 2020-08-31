const express = require("express");
const router = express.Router();
const {
  loadPrivatePage,
  loadSignupPage,
  signupUser,
  loadLoginPage,
  loginUser,
  logout,
} = require("../controllers/auth");

// Require user model
// const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
// const { genSaltSync, hashSync } = require("bcrypt");

// Add passport

const ensureLogin = require("connect-ensure-login");

router.get("/private", ensureLogin.ensureLoggedIn(), loadPrivatePage);

router.get("/signup", loadSignupPage);

router.post("/signup", signupUser);

router.get("/login", loadLoginPage);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports = router;
