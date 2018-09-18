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

/* Login */
router.get('/login', (req, res) => {
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));

/*SignUp*/
router.get('/signup', (req, res) => {
  res.render('passport/signup')
});
router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 
  //Require some input
  if (username === "" || password === "") {
    res.render("passport/signup", {message: "Indicate User and Password"});
    return;
  }
  User.findOne({username})
  .then(user => {
    //If user exists..
    if (user != null){
    res.render("passport/signup", { message: "The username already exists" });
    }
  })
  .catch(error => {
    next(error);
  });

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword
    });

    newUser.save()
    .then(() => {
      //once created and saved, lets go back to signup page with a message
      res.render("passport/signup", {message: `User: ${username} created `});
    })
    .catch (error => {
      next(error);
    })
  });



module.exports = router;
