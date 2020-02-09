/*jshint esversion: 6 */

const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/User");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

/* GET singup */
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

/* POST singup*/
passportRouter.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      const cryptPass = bcrypt.hashSync(password, 10);
      await User.create({ username, password: cryptPass });
      return res.redirect("/");
    } else {
      return res.render("passport/signup");
    }
  } catch (e) {
    next(e);
  }
});

/* GET private */
passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
