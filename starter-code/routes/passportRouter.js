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

router.get("/signup", (req, res, next) => {
    if(req.user) {
      res.redirect("/");

      return;
    }

    res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
      User.findOne({ email: req.body.signupUserame })
      .then((userFromDb) => {


      const salt = bcrypt.genSaltSync(10);

      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new User({
        username: req.body.signupUserame,
        password: scrambledPassword
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
  if(req.user) {
    res.redirect("/");

    return;
  }
    res.render("passport/login");
});

router.post("/process-login", (req, res, next) => {
    User.findOne({ username: req.body.loginUser })
    .then((userFromDb) => {
        if (userFromDb === null){
          res.locals.errorMessage = "username incorrect";
          res.render("passport/login");

          return;
        }


      const isPasswordGood =
      bcrypt.compareSync(req.body.loginPassword, userFromDb.password);

      if (isPasswordGood === false){
        res.locals.errorMessage = "Password incorrect";
        res.render("passport/login");

        return;
      }



        req.login(userFromDb, (err) => {
          if(err) {

            next(err);
        }
        else {

          res.redirect("/");
        }
        });
     })
    .catch((err) => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {

  req.logout();

  res.redirect("/");
});



module.exports = router;
