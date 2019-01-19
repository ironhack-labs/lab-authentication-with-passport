const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const bcryptSalt = 10;
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if(username == "" || password == "") {
    res.render('passport/sognup', {
      message: 'Indica tu nombre de usuario y contraseña'
    })
    return
  }

  User.findOne({username})
  .then(user => {
    if(user !== null) {
      res.render('passport/signup', {
        message: `El usuario ${username} ya se encuentra registrado`
      })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User ({
      username,
      password: hashPass
    })

    newUser.save((err) => {
      if (err) {
        res.render('passport/signup', {
          message: 'Algo salió mal y no se pudo guardar tu registro. Intenta de nuevo más tarde'
        })
      } else {
        res.redirect('/')
      }
    })
  })
  .catch(error => {
    next(error)
  })
})

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

// passportRouter.get("/passport/google", passport.authenticate("google", {
//   scope: ["https://www.googleapis.com/auth/plus.login", 
//           "https://www.googleapis.com/auth/plus.profile.emails.read"]
// }));

// passportRouter.get("/auth/google/callback", passport.authenticate("google", {
//   failureRedirect: "/",
//   successRedirect: "/private-page"
// }));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;