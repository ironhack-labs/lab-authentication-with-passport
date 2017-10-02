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

router.get('/signup', (req, res, next) =>{
  res.render('passport/signup', {message:''});
});

router.post('/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  // Checking that the username isnt taken
  User.findOne({username},'username', (err,user) =>{
    if(user !==null){
      res.render('passport/signup', {
        message:"the username already exists "
      })
      return
    }

    // Creating the User
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User ({
      username,
      password: hashPass
    })

    // Saving the user in the database
    newUser.save( (error) => {
      if (error) {
        res.render('/signup', { message: 'Something went wrong'})
      } else {
        res.redirect('/')
      }
    })
  })
})

router.get('/login',(req,res,next)=>{
  res.render('passport/login',{"message" : req.flash("error")});
})

router.post('/login',passport.authenticate("local",{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
})
);

router.get('/logout',(req, res) =>{
  req.logout();
  res.redirect('/login');
});








module.exports = router;
