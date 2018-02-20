const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

// Add new route with path /signup & point it to
// passport/signup 
router.get('/signup', (req, res, next) => {
  res.render('passport/signup')
});

// Post Route to receive data from signup form 
// and create a new user with the data 
router.post('/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  // Check for whether user has provided
  // username and password
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
      
    // Validation 2 - Check whether User already exists in the database
    if (user != null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
    }

    // Encrypt password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // Generate new User with encrypted password
    const newUser = new User({
        username,
        password: hashPass
    });

    // Save the new User to the database
    newUser.save((err) => {
        if (err) {
            res.render("passport/signup", { message: "Something went wrong" });
        } else {
            res.redirect("/");
        }
    });
  });
});

// Display a Login Form 
router.get('/login', (req, res, next) => {
  res.render('passport/login', { 'message' : req.flash('error')});
});

// Route to Handle Login Form Submission
router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Route to Display Private Page 
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;

