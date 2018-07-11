const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin   = require("connect-ensure-login");

//for passport advanced auth
const passport      = require("passport");


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) =>{
  res.render('passport/signup');
});

router.post("/signup", (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/");
      }
    });
  });

});

//for basic auth with no error flash
// router.get("/login", (req, res, next) => {
//   res.render("passport/login");
// });

//for passport auth, advanced flash error
router.get("/login", (req, res, next) => {
  res.render("passport/login", {"errorMessage": req.flash("error")});
});

//for basic auth
// router.post("/login", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "" || password === "") {
//     res.render("passport/login", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }

//   User.findOne({ "username": username }, (err, user) => {
//       if (err || !user) {
//         res.render("passport/login", {
//           errorMessage: "The username doesn't exist"
//         });
//         return;
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         res.render("passport/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   });
// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login", );
  }
});

//for basic auth
// router.get("/private", (req, res, next) => {
//   var user = req.session.currentUser;
//   //console.log(user);
//   res.render("passport/private", {user});
// });

//for basic auth
// router.get("/logout", (req, res, next) => {
//   req.session.destroy((err) => {
//     // cannot access session here
//     res.redirect("passport/login");
//   });
// });

//for passport auth advanced
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;