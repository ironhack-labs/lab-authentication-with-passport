const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup",);
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    return res.render("signup", {
        errorMessage: "Indicate a username and a password to sign up"
    });
  }

  User.findOne({ "username": username },
    "username",
    (err, user) => {
        if (user !== null) {
            res.render("signup", {
            errorMessage: "The username already exists"
            });
            return;
        }

        var salt = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);

        var newUser = User({
            username: username,
            password: hashPass,
        });

        newUser.save((err) => {
            if (err) {
            res.render("signup", {
                errorMessage: "Something went wrong"
            });
            } else {
                res.redirect("/login");
            }
        });
    });

  // res.render("passport/private", { user: req.user });
});


router.get("/login", (req, res) => {
  res.render("passport/login",{ "errorMessage": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = router;
