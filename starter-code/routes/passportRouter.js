const express        = require("express");
const router         = express.Router();
const bcrypt         = require("bcrypt");
const User           = require("../models/user");

const bcryptSalt     = 10;

const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



//Add a new route to your passportRouter.js file with the path /signup and point it to your views/passport/signup.ejs file.
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
})

router.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === ''){
    res.render("passport/signup", {
      errorMessage: 'Indicate a username and a password to sign up.'
    });
    return;
  }

  User.findOne({"username": username}, "username", (err, user) => {

    //si troba l'user
    if(user !== null) {
      res.render("passport/signup", {
        errorMessage: 'The username already exists.'
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User ({
      username: username,
      password: hashPass
    });
    

    newUser.save((err) => {
      res.redirect("/");
    });

  });  
}); 

router.get('/login', (req, res, next) =>{
  res.render('passport/login');
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user.username });
});






module.exports = router;
