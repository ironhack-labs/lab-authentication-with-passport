const express        = require("express");
const passportRouter = express.Router();
const Users = require ('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");




passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.json({
      message: "Indicate username and password",
    });
    return;
  }

  Users.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        res.json({
          message: "The username already exists",
        });
        return;
      }
      const bcryptSalt = 2;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new Users({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.json({
            message: "Something went wrong",
            
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});
 
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
); 
passportRouter.get("/private-page",ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private");
});
 

module.exports = passportRouter;