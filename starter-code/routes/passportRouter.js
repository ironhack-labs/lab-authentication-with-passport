const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;

// Signin route
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login"), {
    message: req.flash("error")
  };
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("views/passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
      username: username
    })
    .then(user => {
      if (user !== null) {
        res.render("views/passport/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

// // Passport Local
// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({
//         username: username
//       },
//       function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, {
//             message: "Incorrect username."
//           });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, {
//             message: "Incorrect password."
//           });
//         }
//         return done(null, user);
//       }
//     );
//   })
// );

//GET HOME PAGE
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", {
      user: req.user
    });
  }
);

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;