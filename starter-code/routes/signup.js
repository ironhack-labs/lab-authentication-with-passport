const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { isLoggedOut } = require("../lib/isLogged");
const { hashPassword } = require("../lib/hashing");

// Add bcrypt to encrypt passwords

// Add passport

router.get("/", (req, res) => {
  res.render("auth/signup", { signup: true });
});

router.post("/", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  const existingUser = await User.findOne({ username });
  console.log("Existing User", existingUser);
  if (!existingUser) {
    const newUser = await User.create({
      firstname,
      lastname,
      username,
      password: hashPassword(password)
    });
    console.log(newUser);
    // req.flash("info", `Created user ${username}`);
    req.login(newUser, () => {
      return res.redirect("/");
    });
  } else {
    // req.flash("error", "User already exists with this username");
    req.flash("error", "User already exists with this username");
    return res.redirect("/signup");
  }
});

module.exports = router;
