const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  const { id, firstname, lastname, username } = req.body;
  console.log("firstname", firstname, "lastname", lastname, "username", username);
  res.render("auth/profile");
});

router.post("/", async (req, res) => {
  const { firstname, lastname, username } = req.body;
  console.log("firstname", firstname, "lastname", lastname, "username", username);
  await User.findByIdAndUpdate(req.user._id, {
    firstname,
    lastname,
    username
  });
  res.redirect("/profile");
});
module.exports = router;
