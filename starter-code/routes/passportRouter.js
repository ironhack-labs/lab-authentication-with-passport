const express = require("express");
const Router = express.Router();
const model = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");

Router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

Router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await model.findOne({ username });
  if (!existingUser) {
    const newUser = await model.create({
      username,
      password: hashPassword(password)
    });
    console.log(`Creado el usuario ${username}`);
    res.redirect("/");
  } else {
    res.render("/signup");
  }
});

Router.get("/login", isLoggedOut(), (req, res, next) => {
  res.render("passport/login");
});

Router.post(
  "/login",
  isLoggedOut(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })
);

Router.get("/logout", isLoggedIn(), async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

Router.get("/private-page", isLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = Router;
