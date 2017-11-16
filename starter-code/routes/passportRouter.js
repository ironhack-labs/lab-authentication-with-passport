const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

// ensureLogin.ensureLoggedIn(), 

router.get("/private-page", (req, res) => {
  if (req.user === undefined) {
    res.redirect("/login");

    return;
  }
  res.render("passport/private");
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup.ejs");
});

router.post("/process-signup", (req, res, next) => {
  if (req.body.signupPassword === "" ||
      req.body.signupPassword.length < 8 ||
      req.body.signupPassword.match(/[^a-z0-9]/i) === null) {
        res.locals.errorMessage = "Password is invalid";
        res.render("passport/signup.ejs");

        return;
      }
      User.findOne({username: req.body.signupUsername})
      .then((userFromDb) => {
        if (userFromDb !== null) {
          res.locals.errorMessage = "Username is taken!";
          res.render("passport/signup.ejs");

          return;
        }
      const salt = bcrypt.genSaltSync(10);

      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new User({
        username: req.body.signupUsername,
        encryptedPassword: scrambledPassword
      });
      return theUser.save();

      })

  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    next(err);
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login.ejs");
});

router.post("/process-login", (req, res, next) => {
  User.findOne({username: req.body.loginUsername})
  .then((userFromDb) => {
    if (userFromDb === null) {
      res.locals.errorMessage = 'Email incorrect.';
      res.render("user-views/login-page");

      return;
    }
    const isPasswordGood =
      bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

      if (isPasswordGood === false) {
        res.locals.errorMessage = 'Password incorrect';
        res.render("user-views/login-page");

        return;
      }
      req.login(userFromDb, (err) => {
        if (err) {
          next(err);
        } else {
          res.redirect("/");
        }
      });
  })
  .catch((err) => {
    next(err);
  });
});





module.exports = router;
