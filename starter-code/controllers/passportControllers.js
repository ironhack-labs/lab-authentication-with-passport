const User = require("../models/user");
const { genSaltSync, hashSync } = require("bcrypt");

exports.getSignUp = (req, res) => {
  res.render("passport/signup");
};

exports.getLogin = (req, res) => {
  res.render("passport/login");
};

exports.postSignUp = async (req, res) => {
  const { username, password } = req.body;
  const salt = genSaltSync(10);
  const hashPassword = hashSync(password, salt);
  const user = await User.findOne({ username });
  if (username === "" || password === "") {
    return res.render("passport/signup", {
      message: "Incomplete field"
    });
  }
  if (user !== null) {
    return res.render("passport/signup", {
      message: "User already exist"
    });
  }
  await User.create({ username, password: hashPassword });
  res.redirect("/");
};
