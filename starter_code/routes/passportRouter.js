const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get('/signup', (req, res, next) => {
    res.render('passport/signup');
  });
   
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
  
      newUser.save(err => {
        res.redirect("/");
      });
    });
  });
  
  router.get('/login', (req, res, next) => {
    res.render('passport/login');
  });
  
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: false,
      passReqToCallback: false
    })
  );
  
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "//login",
      failureFlash: false,
      passReqToCallback: false
    })
  );
   
   router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
     res.render("passport/private", { user: req.user });
  
  });
  
  module.exports = router; 




// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

// router.get("/signup", (req, res) => {
//   res.render("passport/signup");
// });

// router.post("/signup", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//    if (username === "" || password === "") {
//      res.render("passport/signup", { 
//        errorMessage: "Invalid username and/or password" });
//      return;
//    }

//   User.findOne({ username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("passport/signup", { 
//         errorMessage: "This name is already in use" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username,
//       password: hashPass
//     });

//     newUser.save(err => {
//       if (err) {
//         res.render("passport/signup", { message: "Try Again" });
//       } else {
//         res.redirect("/");
//       }
//     });
//   });
// });

// router.get("/login", (req, res) => {
//   res.render("passport/login");
// });

// router.post("/login", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "" || password === "") {
//     res.render("passport/login", {
//       errorMessage: "Please use your name and password"
//     });
//     return;
//   }

//   User.findOne({ username: username }, (err, user) => {
//     if (err || !user) {
//       res.render("passport/login", {
//         errorMessage: "Can't find user, try again"
//       });
//       return;
//     }
//     if (bcrypt.compareSync(password, user.password)) {
//       // Save the login in the session!
//       // req.session.currentUser = user;
//       res.redirect("/passport/private-page");
//     } else {
//       res.render("passport/login", {
//         errorMessage: "Wrong password"
//       });
//     }
//   });
// });
    
// module.exports = router;
