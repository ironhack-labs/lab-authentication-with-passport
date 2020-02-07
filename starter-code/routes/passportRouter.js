const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
// Add passport
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => res.render("passport/signup"));
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      const cryptPass = bcrypt.hashSync(password, 10);
      await User.create({ username, password: cryptPass });
      return res.redirect("/");
    } else {
      return res.render("passport/signup");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
