const { Router } = require("express");
const router = new Router();
// Require user model
const User = require("../models/User.model");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

//GET SIGNUP
router.get("/signup", (_, rest) => rest.render("auth/signup"));

//POST SIGNUP
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", { errorMsg: "Indicate username and password" });
    return;
  }
  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", { msg: "The username already exists" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, passwordHash: hashPass })
      .then(res.redirect("/"))
      .catch((err) => next(err));
  });
});

//GET LOGIN
router.get("/login", (req, res) =>
  res.render("auth/login", { errorMessage: req.flash("error") })
);

//POST LOGIN
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true, // !!!
  })
);

module.exports = router;
