const User = require("../models/User.model");
const { genSaltSync, hashSync } = require("bcrypt");
const passport = require("../config/passport");

exports.loadPrivatePage = (req, res) => {
  res.render("auth/private", { user: req.user });
};
exports.loadSignupPage = (req, res) => {
  res.render("auth/signup");
};

exports.signupUser = async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    return res.render("auth/signup", { error: "missing fields" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render("auth/signup", { error: "Error" });
  }
  const hashPwd = hashSync(password, genSaltSync(12));

  await User.create({ username, password: hashPwd });
  res.redirect("/login");
};

exports.loadLoginPage = (req, res) => {
  res.render("auth/login", { error: req.flash("error") });
};

exports.loginUser = passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};
