const express = require("express");
const passportRouter = express.Router();

const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');


// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const session = require("express-session")
const bcrypt = require("bcrypt")
const bcryptSalt = 10;
// Add passport 
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy


const ensureLogin = require("connect-ensure-login");
const Swag = require('swag');
Swag.registerHelpers(hbs);

//////////////////////////////////
//Inicialización de Middleware
/////////////////////////////////

passportRouter.use(bodyParser.json());
passportRouter.use(bodyParser.urlencoded({
  extended: false
}));

passportRouter.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  })
);

passport.use(
  new LocalStrategy({
      passReqToCallback: true
    },
    (req, username, password, next) => {
      User.findOne({
          username
        },
        (err, user) => {
          // todo: watch with mongodb stopped
          if (err) {
            return next(err);
          }

          if (!user) {
            return next(null, false, {
              message: "Incorrect username"
            });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: "Incorrect password"
            });
          }

          return next(null, user);
        }
      );
    }
  )
);


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.get("/signup", (req, res) => {
  res.render('passport/signup');
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    // res.render("base", {
    //   message: "Indicate username and password",
    //   section: "signup"
    // });
    res.json({
      message: "The username already exists"
    })
    return;
  }

  User.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        // res.render("base", {
        //   message: "The username already exists",
        //   section: "signup"
        // });
        res.json({
          message: "The username already exists"
        })
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
          res.render("base", {
            message: "Something went wrong",
            section: "signup"
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

module.exports = passportRouter;