const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user.js");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get("/signup", (req, res, next) => {
  res.render("passport/signup.hbs")
 });

router.post("/process-signup", (req, res, next) => {
const { username, newPassword } = req.body;

const password = bcrypt.hashSync(newPassword, 10);

User.create({ username, password })
  .then((userDoc) => {
    res.redirect("/");
  })
  .catch((err) => {
    next(err);
  });
})

router.get("/login", (req, res, next) => {
  res.render("passport/login.hbs")
})

router.post('/process-login', (req, res, next) => {
  const {username, loginPassword} = req.body;

  User.findOne({username})
  .then((userDoc) => {
    if(!userDoc) {
      res.redirect("/login");
      return;
    }

    const { password } = userDoc;

    if (!bcrypt.compareSync(loginPassword, password)){
      res.redirect("/login");
      return;
    }

    req.login(userDoc, () => {
      res.redirect("/");
    });
  })
  .catch((err) => {
    next(err);
  });
})

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
})


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;