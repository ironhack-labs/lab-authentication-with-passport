const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
// Require user model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require("passport");
const bcryptSalt = 10;

const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});
passportRouter.get('/login', (req, res) => {
  res.render('passport/login');
});

// passportRouter.post("/signup", (req, res) => {
//   user.create({
//     username:req.body.username,
//     password: req.body.password
//   })
// });


passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});
passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass
      });
      newUser.save((err) => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});
// passportRouter.post("/signup", (req, res, next) => {
//   const { username, password } = req.body;
//   if (username === "" || password === "") {
//     res.render("signup", {
//       message: "Indicate username and password",
//       section: "signup"
//     });
//     return;
//   }
//   user.findOne({
//     username
//   })
//     .then(user => {
//       if (user !== null) {
//         res.render("signup", {
//           message: "The username already exists",
//           section: "signup"
//         });
//         return;
//       }
//       const salt = bcrypt.genSaltSync(bcryptSalt);
//       const hashPass = bcrypt.hashSync(password, salt);
//       const newUser = new user({
//         username,
//         password: hashPass
//       });
//       newuser.save(err => {
//         if (err) {
//           res.render("signup", {
//             message: "Something went wrong",
//             section: "signup"
//           });
//         } else {
//           res.redirect("/");
//         }
//       });
//     })
//     .catch(error => {
//       next(error);
//     });
// });

passportRouter.get("/login", (req, res) => {
  user.create({
    username: req.body.username,
    password: req.body.password
  })
})

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;