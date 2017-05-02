const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const flash         = require("connect-flash");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render('passport/signup');
});
// process form signup
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne( {username: username}, (err, user) =>{
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "This username already exists"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    console.log('username: ', username);
    console.log('password: ', hashPass);



    var newUser  = new User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      console.log('save');
      res.redirect('/');
    });
  });

});
/////////////////////////////////
/////////////LOGIN//////////////
router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("passport/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }



      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("passport/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
