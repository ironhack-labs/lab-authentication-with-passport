const express = require("express");
const passportRouter = express.Router();
const flash = require("connect-flash")
// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport")


const ensureLogin = require("connect-ensure-login");


// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body
  if (username === "" || password === "") {
    res.render("passport/signup", { msg: "You didn't put anything!" })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        console.log('hollllaaaaaaaaa', user)
        res.render("passport/signup", { msg: "The username already exists!" })
        return
      }

      console.log("You shouldnt see me")

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass
      })

      newUser.save()
        .then(createdUser => {
          console.log(createdUser)
          res.redirect("/")
        })
        .catch(err => {
          res.render("user/signup", { msg: "Somenthing went super worse than expected" })
          console.log("Algo no va bien", err)
        })
    });
})



passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { msg: req.flash("ERRRRRROR!") });
});


passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/")
})

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/user/login')
  }
}

// RUTA PRIVADA
passportRouter.get('/private-page', ensureAuthenticated, (req, res) => {
  res.render('passport/private', { user: req.user })
})



module.exports = passportRouter;