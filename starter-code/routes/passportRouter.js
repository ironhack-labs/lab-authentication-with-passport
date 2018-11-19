const express = require("express");
const passportRouter = express.Router();
const session = require("express-session");
const app = express();
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../models/user");
const genericUser = new User();
const passport = require("passport");




passportRouter.get("/signup", function(req, res, next) {
  res.render("passport/signup");
});
passportRouter.post("/signup", (req, res, next) => {
  const saltRounds = 5;

  genericUser.username = req.body.username;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  genericUser.password = hash;

  genericUser.save().then(x => {
    req.session.inSession = true;
  });

  res.redirect("/login");

  console.log(req.body);
});

passportRouter.get("/login", function(req, res) {
  res.render("passport/login");
});



passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
  }));

// });

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
