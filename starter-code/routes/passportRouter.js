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

router.get("/signup", (req, res) => {
  res.render("passport/signup",{});
});
router.post("/signup", (req, res) => {
  let { username,password  } = req.body;
  if (username === "" || password === "") {
    res.render("passport/signup",{message: "the username or the password are empty!!"});
  return;
  }
  User.findOne({ username},"username", (err,user) => {
    if (user !== null) {
        res.render("/signup",{message: "the username already exist!!"});
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password,salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err)=>{
      if(err){
        res.render('/signup',{ message: "something went wrong"});
      }else{
        res.redirect('/');
      }
    })
  });

});








module.exports = router;
