const express        = require("express");
const router         = express.Router();
// User model
const UserModel           = require("../models/user");
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
      req.body.signupPassword.match(/[^a-z0-9]/i) === null
  ) {
      res.locals.errorMessage = "Password is invalid";
      res.render("passport/signup");
      return;
  }

  UserModel.findOne({username: req.body.signupUsername})
    .then((userFromDb) => {

        if (userFromDb !== null) {
            res.locals.errorMessage = "This username is taken.";
            res.render("passport/signup");

            return;
        }
        // generate a new salt for this user's password
        const salt = bcrypt.genSaltSync(10);
        // encrypt the password submitted by the user from the form
        const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

        // register the new user
        const theUser = new UserModel({
            username: req.body.signupUsername,
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


//LOG IN
router.get("/login", (req, res, next) => {
    if (req.user) {
        res.redirect("/");

        return;
    }

    res.render("passport/login");
});

router.post("/process-login", (req, res, next) => {

  UserModel.findOne({username: req.body.loginUsername})
    .then((userFromDb) => {
        if(userFromDb === null) {

            res.locals.errorMesage = "Incorrect Username.";
            res.render("passport/login");

            return;
        }

        const isPasswordGood = bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

        if(isPasswordGood === false) {
            res.locals.errorMessage = "Password is incorrect.";
            res.render("passport/login");
            // if there is an error, prevent the rest of the code from running
            return;
        }
        // CREDENTIALS ARE GOOD! We need to log the users in.

        // Passport defines the "reg.login()" method
        // for us to specify when to log in a user into the session
        req.login(userFromDb, (err) => {
            // check to see if the log in worked
            if (err) {
              // if it didn't show the error page
              next(err);
            }
            else {
              // if it worked, redirect to the home page
              res.redirect("/");
            }
        }); // req.login()
    }) // then()

    .catch( (err) => {
      next(err);
    });
});






// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });






module.exports = router;
