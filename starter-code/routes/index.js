const express = require('express');
const router  = express.Router();
const passport = require("../config/passport")
const User = require("../models/User")
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  const options = {
    title: "Sign up",
    action: "/signup",
    signup: true
  };
  res.render("passport/form", options);
});

router.post("/signup", async (req, res, next) => {
  const user = await User.register({ ...req.body }, req.body.password);
  console.log(user);
  res.redirect("/login");
});

router.get("/login", (req, res, next) => {
  const options = {
    title: "Log in",
    action: "/login"
  };
  res.render("passport/form", options);
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  res.redirect("/private-page");
});

router.get("/private-page", isLoggedIn, (req, res) => {
  res.render("passport/private", { user: req.user });
  console.log(req.user);
});

function isLoggedIn(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect("/login");
}


module.exports = router;
