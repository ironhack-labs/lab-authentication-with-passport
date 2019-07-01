const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getSignup = (req, res) => {
  res.render("passport/signup");
};

exports.postSignup = async (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const user = await User.findOne({ username });
  if (username === "" || password === "") {
    return res.render("passport/signup", {
      message: "empty"
    });
  }
  if (user !== null) {
    return res.render("passport/signup", { message: "already exists" });
  }
  await User.create({ username, password: hashPassword });
  res.redirect("/login");
};

exports.getLogin = (req, res) => {
  res.render("passport/login");
};
