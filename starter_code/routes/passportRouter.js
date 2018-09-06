const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

//////////////////////////////////////////////////////////////
// MY SECRET PAGE
//////////////////////////////////////////////////////////////
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//////////////////////////////////////////////////////////////
// MY SHIT
//////////////////////////////////////////////////////////////
router.get("/signup", function(req, res, next){
  // res.send("welcome to the login route")
  res.render("passport/signup.hbs")
})

router.post("/process-signup", function(req, res, next){
  const {username, originalPassword} = req.body;

  const password = bcrypt.hashSync(originalPassword, 10);

  User.create( { username, password } )
  .then(userDoc => {
    console.log("user " + username + " created" )
    //res.send("created")
    res.redirect("/")
  })
  .catch(err => next(err))
})

router.get("/login", function(req, res, next){
  res.render("passport/login")
})

router.post("/login", function(req, res, next){

  const { username, originalPassword } = req.body

  User.findOne( { username: { $eq: username } } )
  .then(userDoc => {
    if (!userDoc){
      // res.send("you have no doc in db")
      res.redirect("/signup")
      return
    }

    const {password} = userDoc;
    if (!bcrypt.compareSync(originalPassword, password) ){
      // res.send("pwd doesnt match")
      res.redirect("/login")
      return
    }

    // LOGIN THE USER
    req.logIn(userDoc, () => {
      // res.send("you have logged in!!!!")
      res.redirect("/private-page")
    })
  })
  .catch(err => next(err))
})

router.get("/logout", function(req, res, next){
  req.logOut()
  res.redirect("/")
})


//////////////////////////////////////////////////////////////
// EO MY SHIT
//////////////////////////////////////////////////////////////

module.exports = router;
