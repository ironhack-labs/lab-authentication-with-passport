const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// Iteration #1: Add a new route to your passportRouter.js file with the path /signup
//  and point it to your views/passport/signup.hbs file.
router.get("/signup", (req, res, next)=> {
  res.render('passport/signup.hbs');
})

// Iteration #1: Finally, add a post route to your passportRoute to receive the data from the signup form
// and create a new user with the data.
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render('passport/signup.hbs', { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup.hbs", { message: "The username already exists" });
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
        res.render("passport/signup.hbs", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

// Iteration #2: In order to add the login feature, let's add 1 get route to our router to display the login page.
router.get("/login", (req, res, next)=> {
  res.render('passport/login.hbs', { "message": req.flash("error") });
})

// Iteration #2: Once we have the (login) form, let's add another route to the router
//  to receive that data and log the user in.
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  // failureFlash: true,
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
