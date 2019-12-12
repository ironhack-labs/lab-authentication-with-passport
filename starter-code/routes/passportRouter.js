const express        = require("express");
const passportRouter = express.Router();

const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Signup
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password ) {
    res.render("passport/signup", { errorMessage: "Username et password incorrectes" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { errorMessage: "L'utilisateur existe déjà." });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser
        .save()
        .then(user => res.redirect("/"))
        .catch(err => next(err))
      ;
        
    })
    .catch(err => next(err))
  ;

})

// login
router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

// Private Page
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;