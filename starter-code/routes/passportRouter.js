const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


//private page

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


// 1. sign up page

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

// 2. process for sign up page

router.post("/process-signup", (req, res, next) => {

  const salt = bcrypt.genSaltSync(10);

  User.findOne({ userName: req.body.signupUsername})
   .then((userFromDb) => {
     // userFromDb will be null if the Username IS NOT taken

     // display the form again if the Username is taken
     if(userFromDb !== null) {
       res.locals.errorMessage = "Username is taken";
       res.render("passport/signup");
     }

    if(req.body.signupUsername === null){
      res.locals.errorMessage = "We need a username";
      res.render("passport/signup");

      return;
    }

    if (req.body.signupPassword.length < 5 ||
        req.body.signupPassword.match(/[^a-z0-9]/i) === null
    ) { //if no special characters  (Regular expression)
      res.locals.errorMessage = "Password is invalid";
      res.render("passport/signup");

      //early return: stops function from continuing since there's an error
      return;
    }

    //encrypt the password password submitted by the user from the form
    //
    const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

    const theUser = new User({

      username: req.body.signupUsername,
      password: scrambledPassword

    });

    return theUser.save();
  })

  .then(() => {
    // 3. redirect for sign up page
    //redirect users to home page if sign up was successful
    res.redirect('/');
  })
  .catch((err) => {
    next(err);
  });
}); // closes sign up


// 1. login page

router.get("/login", (req, res, next) => {
  // redirect to home if you are already logged in
    if(req.user){
      res.redirect("/");
  // early return to stop the function since there's an error
  //(prevents the rest of the code form running)
      return;
    }
  res.render("passport/login");
});

// STEP #2 process the log in form
router.post("/process-login", (req,res, next) => {
  // find a user document in the database with that email
  User.findOne({ username: req.body.loginUsername })
  .then((userFromDb) => {
    if (userFromDb === null) {
      // if we didn't find a user
      res.locals.errorMessage = "Username incorrect.";
      res.render("passport/login");

      // early return to stop the function since there's an error
      // (prevents the rest of the code from running)
      return;
    }
    // if email is correct now we check the password
    const isPasswordGood =
     bcrypt.compareSync(req.body.loginPassword, userFromDb.password);

     if (isPasswordGood === false) {
       res.locals.errorMessage = "Password incorrect.";
       res.render("passport/login");

       // early return to stop the function since there's an error
       // (prevents the rest of the code from running)
       return;
     }

     // CREDENTIALS ARE GOOD! We need to log the users in


      // Passport defines the "req.login()"
      // for us to specify when to log in a user into the session
      req.login(userFromDb, (err) => {
        if (err) {
          // if it didn't work show the error page
          next(err);
        }
        else {
          //redirect to the home page on successful log in
          res.redirect("/");
        }
      }); //req.login()
  })// then()
  .catch((err) => {
    next(err);
  });
}); // closes log in

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;
