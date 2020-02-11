const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const model = require("../models/User");
const { hashPassword, checkHashed } = require("../lib/hashing");
const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
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
    console.log(`user created is ${username}`);
    res.redirect("/");
  } else {
    res.render("passport/signup");
  }
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })
);

passportRouter.get("/logout", async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);







module.exports = passportRouter;
