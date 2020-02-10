const express = require("express");
const passportRouter = express.Router();


// Require user model
const user = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Add passport 
const passport = require('passport');




const ensureLogin = require("connect-ensure-login");


//*************************************************//GET// ********************************************

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup")
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login")
})

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('estefania');
  res.render("passport/private", { user: req.user });
});



//*************************************************//POST// ********************************************


//signup//
passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  user.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
      }

    },
    )

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new user({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render("/signup", { message: "Something went wrong" });
    } else {
      res.redirect("/login");
    }
  });


});


// login //


passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));



module.exports = passportRouter;

