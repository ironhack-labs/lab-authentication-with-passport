const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedOut } = require("../lib/isLoggedIn");
const { hashPassword } = require("../lib/hashing");

// Add bcrypt to encrypt passwords

// Add passport

router.get("/", (req, res) => {
  res.render("auth/signup");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  console.log("Existing User", existingUser);
  if (!existingUser) {
    const newUser = await User.create({
      username,
      password: hashPassword(password)
    });
    console.log(newUser);
    // req.flash("info", `Created user ${username}`);
    return res.redirect("/");
  } else {
    // req.flash("error", "User already exists with this username");
    return res.redirect("/signup");
  }
});

module.exports = router;
