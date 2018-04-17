const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/main", (req, res) => {
    res.render("main");
});

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

/* Auth: recive user & pass and create a new user */
router.post("/signup", (req, res) => {
  let { username, password } = req.body;
  User.findOne({ username: username }, "username", (err, user) => {
    
    if (user !== null) {
      res.render("passport/signup", { errorMessage: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({ username, password: hashPass });
    newUser.save()
      .then(() => res.redirect('/main'))
      .catch(e => console.log(e));

  });
});

router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  User.findOne({ username: username }, "username", (err, user) => {
    
    if (user !== null) { res.redirect('main') }

  });
});





module.exports = router;