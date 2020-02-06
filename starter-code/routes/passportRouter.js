const express = require("express");
const router = express.Router();
const { hashPassword, checkHashed } = require("../lib/hashing");
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
// Add passport
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const existUser = await User.findOne({ username });
  const newUser = await User.create({
    username,
    password: hashPassword(password)
  });
  console.log(`User Creater: ${newUser}`);
  return res.redirect("/");
});

const ensureLogin = require("connect-ensure-login");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
