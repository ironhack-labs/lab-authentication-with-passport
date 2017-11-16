const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


router.get("/signup", (req, res, next) => {
    if (req.user) {
        res.redirect("/");

        return;
    }

    res.render("passport/signup");
});

router.post("/process-signup", (req, res, next) => {
  if (req.body.signupPassword.length < 8 ||
                              // No special characters
      req.body.signupPassword.match(/[^a-z0-9]/i) === null
  ) {
      res.locals.errorMessage = "Password is invalid";
      res.render("passport/signup");
      // early return to prevent the rest of the code from running
      return;
  }

  //query the database to see if the email is taken
  User.findOne({email: req.body.signupEmail})
    .then((userFromDb) => {
        // userFromDb will be null if the email IS NOT taken

        // display the form again if the email is taken
        if (userFromDb !== null) {
            res.locals.errorMessage = "This email is already registered.";
            res.render("passport/signup");

            // early return to stop the function since there's an error
            // (prevents the rest of the code from running)
            return;
        }
        // generate a new salt for this user's password
        const salt = bcrypt.genSaltSync(10);
        // encrypt the password submitted by the user from the form
        const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

        // register the new user
        const theUser = new User({
            fullName: req.body.signupFullName,
            email:    req.body.signupEmail,
            encryptedPassword: scrambledPassword
        });
        // return the promise of the next database query
        // to continue the sequence
        return theUser.save();
    })
    .then( () => {
        //redirect to the home page on a successful sign up
        res.redirect("/");
    })

    .catch( (err) => {
        next(err);
    });
});









// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });






module.exports = router;
