const express        = require('express');
const router         = express.Router();
// Add passport 
const passport       = require('passport')
// Require user model
const User           = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt         = require('bcryptjs')
const bcryptSalt     = 10;

router.get('/signup', (req, res) => {
  res.render('passport/signup', { user: req.user });
});

router.post('/signup', (req, res, next) =>{
  const {fullName, email, password} = req.body
  if( email == ""|| password == "" || fullName == ""){
    req.flash ('error', ' Please fill all the fields.')
    res.render('passport/signup');
    return;
  }
  User.findOne({'email': email})
    .then(foundUser =>{
      if(foundUser !== null){
        req.flash('error', "There's already an user with the email. Please try again")
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt)
      User.create({
        email: email,
        password: hashPass,
        fullName: fullName
      })
        .then(user =>{
          req.login(user, (err)=>{
            if(err){
              //===>req.flash.error = 'Error message'
              req.flash('error', 'Auto login does not work. Please login manually')
              res.redirect('/');
              return;
            }
            res.redirect('/')
          })
        })
        .catch(err => next(err));//closing User.create()
    })
    .catch(err => next(err));
})

router.get('/login', (req, res, next) =>{
  res.render('passport/login')
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//========================LOGOUT=======
router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
})

module.exports = router;