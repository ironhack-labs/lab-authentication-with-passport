const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("passport/signup", {
        errorMessage: err.message
      });
    })
})


router.get('/login', (req, res, next) => {  
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: true,
    passReqToCallback: true
  })
)


// router.post("/login", (req, res, next) => {

//   const {username, password} = req.body;

//   // Check password promise
//   let passCheck = new Promise ((resolve, reject) => {
//     if (username === "" || password === ""){
//       return reject(new Error("Indicate a username and a password to sign up"));
//     }
//     resolve();
//   }) 

//   // Check password
//   passCheck.then(() => {
//     return User.findOne({ "username": username })
//   }) 
//   .then( user => {
//     // Check user does not exist
//     if(!user) throw new Error("The username doesn't exist");

//     // Check password hash is correct
//     if (!bcrypt.compareSync(password, user.password)){
//       throw new Error("Incorrect Password");
//     }

//     // Save the login in the session!
//     req.session.currentUser = user;
//     console.log(`LOGGED AS USER ${user.username}`);
//     res.redirect("/");

//   })
//   .catch( e => {
//     res.render("auth/login", {
//       errorMessage: e.message
//     });
//   });
// });


router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})


module.exports = router;