const express = require("express");
const passportRouter = express.Router();
const model = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require("connect-ensure-login");

// Create: signup
passportRouter.get("/signup", async (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await model.findOne({ username });
  if (!existingUser) {
    const newUser = await model.create({
      username,
      password: hashPassword(password)
    });
    res.redirect("/");
  } else {
    res.render("passport/signup");
  }
});

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
