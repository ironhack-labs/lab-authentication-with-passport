const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup.ejs");
});

router.post("/process-signup", (req, res, next) => {

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const scrambledPass = bcrypt.hashSync(req.body.password, salt);

  const theUser =  new User({
    username: req.body.username,
    password: scrambledPass
  });
  theUser.save((err) => {
    if(err){
      next(err);
      return;
    }

  });
  res.redirect("/");

});

router.get("/login", (req, res, next) => {
  res.render("passport/login.ejs");
});

router.post("/process-login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);


// In order to add the login feature, let's add 1 get route to our router to display
 // the login page. Once we have that, let's add a form to our views/passport/login.ejs file.
 // The form should make a POST request to /login. Once we have the form, let's add
 // another route to the router to receive that data and log the user in.
//
// But Wait
//
// In order to do that, we need to configure Sessions and initialize a session with
 // passport in our app.js file. We also need to add the passport.serializeUser
 // functions as well as defining the Passport Local Strategy.



module.exports = router;
