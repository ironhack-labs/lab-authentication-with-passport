const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 15
// Add passport 


const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => res.render("../views/passport/signup"))

passportRouter.post("/signup", (req, res, next) => {
  console.log("******* Llegó")
  const { username, password } = req.body
  if (username === "" || password === "") {
    res.render("/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(x => res.redirect("/"))
        .catch(err => res.render("/signup", { message: `Something went wrong: ${err}` }))
    })

})



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;