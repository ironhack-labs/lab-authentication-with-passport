const express = require("express");
const passportRouter = express.Router();

const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');


// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords

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

passportRouter.get("/login", (req, res) => {
  res.render('passport/login');
});

passport.serializeUser((user, cb) => {
  console.log("serialize");
  console.log(`storing ${user._id} in the session`);
  cb(null, user._id);
  // cb(null, {id: user._id, role: user.role});
});

passport.deserializeUser((id, cb) => {
  console.log("deserialize");
  console.log(`Attaching ${id} to req.user`);
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use('local-auth',
  new LocalStrategy(
    // {
    //   passReqToCallback: true
    // },
    (username, password, next) => {
      User.findOne(
        {
          username
        },
        (err, user) => {
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

passportRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);




passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {user: req.user});
});


module.exports = passportRouter;