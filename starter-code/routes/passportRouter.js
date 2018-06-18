const express           = require("express");
const router            = express.Router();
// User model
const User              = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt            = require("bcrypt");
const bcryptSalt        = 10;
const {ensureLoggedIn}  = require("connect-ensure-login");
const passport          = require("passport");

// go to signup page
router.get('/signup', (req,res,next) => {
  res.render('passport/signup');
})

// get data from signup page
router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
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
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;