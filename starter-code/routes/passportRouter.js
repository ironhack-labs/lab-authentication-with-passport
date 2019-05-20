const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// Add bcrypt to encrypt passwords

// Add passport


passportRouter.get("/signup", (req, res, next) =>
  res.render("passport/signup")
);

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) {
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hasPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hasPass }).then(createdUser => {
        console.log(createdUser);
        res.redirect("/");
      });
    })
    .catch();
});

passportRouter.get("/login", (req, res, next) => res.render("passport/login"));
passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
}))
// passportRouter.post('/login', (req, res, next) => {        EMPEZADO SIN PASSPORT
//   const {username, password} = req.body

//   User.findOne({username: username})
//     .then( foundUser => {
//       if(!foundUser) {
//         res.redirect(/))
//       }
//       res.redirect("/")
//     })
// })

passportRouter.get("/private",  ensureLogin.ensureLoggedIn(),  (req, res) => {
  console.log(req.render)
    res.render("passport/private", { username: req.user });
  }
);

module.exports = passportRouter;
