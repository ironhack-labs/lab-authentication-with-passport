const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user-model.js");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup.hbs")
});

passportRouter.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
    User.create({ username, encryptedPassword })
      .then(userDoc => {
        res.redirect("/");
      })
      .catch(err => next(err));
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login.hbs");
});

passportRouter.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;
  
  
  User.findOne({ username: {$eq: username } })
    .then(userDoc => {
      const { encryptedPassword } = userDoc;
      if (bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.logIn(userDoc, () => {
          res.redirect("/");
        });
      } else {
        res.redirect("/login");
      }
    })
    .catch(err => next(err));
});

module.exports = passportRouter;