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

/* show signup form */
router.get("/signup", (req, res) => {
  res.render("passport/signup")
})

/* recive user & pass and create a new user */
router.post("/signup", (req, res) => {
  let { username, password } = req.body;
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(()=> res.redirect('/'))
    .catch(e => console.log(e)); 
  });
});

/* show login form */

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});


/*Check user and log it in */

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;