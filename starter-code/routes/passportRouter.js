const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");

// Require user model
const User = require('../models/user')


// Add bcrypt to encrypt passwords
const bcryptSalt = 10
const bcrypt = require('bcrypt')

// Add passport 
// const passport = require('passport')

passportRouter.get("/signup", (req, res) => res.render("passport/signup"));

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    res.render("passport/signup", { message: "Introduce un usuario y contraseña" });
    return;
  }


User.findOne({ username })

    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe, merluzo" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(x => res.redirect("/"))
        .catch(x => res.render("passport/signup", { message: "Algo fue mal, inténtalo más tarde. Oopsy!" }))
    })
    .catch(error => { next(error) })
});

//// LOGIN SESSION

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.get('/login', (req, res) => res.render('passport/login', { "message": req.flash("error") }))


passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true ///// que es ?^?^?^
}));



module.exports = passportRouter;