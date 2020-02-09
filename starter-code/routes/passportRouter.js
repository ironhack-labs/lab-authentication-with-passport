const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const router = express.Router();

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

//router sigunp passport GET
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

//router signup passport POST
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass
      });
      return newUser.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      res.render("passport/signup", { message: "Something went wrong" });
    });
});

//always export with router const(line7)
module.exports = router;
