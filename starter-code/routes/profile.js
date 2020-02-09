const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn, isLoggedOut } = require("../lib/isLogged");

router.get("/", isLoggedIn(), (req, res) => {
  const { id, firstname, lastname, username } = req.body;
  console.log("firstname", firstname, "lastname", lastname, "username", username);
  res.render("auth/profile");
});

router.post("/", isLoggedIn(), async (req, res) => {
  const { firstname, lastname, username } = req.body;
  console.log("firstname", firstname, "lastname", lastname, "username", username);
  await User.findOneAndUpdate(username, {
    firstname,
    lastname,
    username
  });
  req.flash("info", "Updated User");
  return res.redirect("/profile");
});
module.exports = router;
