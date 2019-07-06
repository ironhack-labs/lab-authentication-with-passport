const { genSaltSync, hashSync } = require("bcrypt");
const User = require("../models/user");

exports.getSignup = (req, res, next) => {
  res.render("passport/signup");
};

exports.postSignup = async (req, res, next) => {
  const { username, password } = req.body;
  const salt = genSaltSync(10);
  const hashPassword = hashSync(password, salt);
  const user = await User.findOne({ username });

  if (username === "" || password === "") {
    return res.render("passport/signup", {
      message: "Username or password empty"
    });
  }
  if (user !== null) {
    return res.render("passport/signup", {
      message: "User already exists"
    });
  }
  await User.create({ username, password: hashPassword });
  res.redirect("/login");
};
exports.getLogin = (req, res) => {
  res.render("passport/login", { message: req.flash("error") });
};
