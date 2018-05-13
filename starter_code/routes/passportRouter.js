const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin   = require("connect-ensure-login");
const passport      = require("passport");

// Lab authentication with passport 


// Add a new route to your passportRouter.js file with the path /signup 
// and point it to your views/passport/signup.hbs file.

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});


// Finally, add a post route to your passportRoute to receive the data 
// from the signup form and create a new user with the data.

// router.get("/signup", (req, res, next) => {
//   res.render("passport/signup");
// });

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
// added username:username 
//mongoose method - findOne
  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "Sorry, The username already exists" });
      return;
    }
// standard for saving the password, password generation 
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      //added : username,

      //key: value (i.e const username =req.body.username)
      username: username,
      password: hashPass
    });
// after const newUser, then .save username and password
    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});
//----end of sign up route------

//iteration #2
router.get("/login", (req, res) => {
  res.render("passport/login", {"message": req.flash("error")});
});

// iter #2 -succesRedire altered to private
router.post("/login", passport.authenticate("local", {
  //private page iteration #2

  // passport standard for logging for username- copy/paste this
  //upon success, user is sent to /private pg
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// this func. verifies if user is logged in, renders user to /private pg. 
router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {user: req.user});
// ^ added {user: req.user} to pull user infro to /passport/private.hbs
//--------ask how user is retrieved

});
// brought


// talk to all files , app.js 
module.exports = router;