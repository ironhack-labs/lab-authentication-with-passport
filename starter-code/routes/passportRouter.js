const express = require("express");
const passportRouter = express.Router();
const model = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");

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
    console.log(`Creado el usuario ${username}`);
    res.redirect("/");
  } else {
    res.render("/signup");
  }
});

passportRouter.get("/login", isLoggedOut(), (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  isLoggedOut(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })
);

passportRouter.get("/logout", isLoggedIn(), async (req, res, next) => {
  req.logout();
  res.redirect("/");
});

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
