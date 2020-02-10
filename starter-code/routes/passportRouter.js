const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const model = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("username");
  const userCreated = await model.findOne({ username });

  if (userCreated) {
    return res.redirect("/signup");
  } else {
    await model.create({
      username,
      password: hashPassword(password)
    });
  }

  return res.redirect("/");
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;
