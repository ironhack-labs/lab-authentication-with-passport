const express = require('express');

const bcrypt = require("bcrypt");

const UserModel = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  if (req.user) {
      res.redirect("/");

      // early return to prevent the rest of the code from running
      // prevent the reset of the code running
      return;
  }
  res.render("passport/signup");
});

// STEP #2) process the sign up form
router.post("/user-signup", (req, res, next) => {

  if (
    req.body.signupPassword === "" ||
    req.body.signupUserName === ""
  ) {

    res.locals.errorMessage = "You Need A User Name and Password";

    res.render("passport/signup");

    return;
  } else if (
      req.body.signupPassword.length <= 6

    ) {

  res.locals.errorMessage = "You Need A Password That is More Than 6 Characters";
  res.render("passport/signup");

  return;
} else if (

    req.body.signupUserName.length <= 4




  ) {
res.locals.errorMessage = "You Need A User Name With 4 or More Characters ";

res.render("passport/signup");

return;
}

UserModel.findOne({ username: req.body.signupUserName })
.then((userFromDb) => {

  if (userFromDb !== null){
    res.locals.errorMessage = "User Name is taken";
    res.render("passport/signup");

    // early return to prevent the rest of the code from running
    // prevent the reset of the code running
    return;
  }
});

const salt = bcrypt.genSaltSync(10);

// encrypt the password submitted by the user from the form
//                                              |
const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

const theUser = new UserModel({
  username: req.body.signupUserName,
  password: scrambledPassword
});

theUser.save()
.then(() => {
  res.redirect("/");
})
.catch((err) => {
  next(err);

});
});
  // STEP # 1 show loging in the form
  router.get("/login", (req, res, next) => {

    res.render("passport/login");
  });


  // STEP # 2 process the  log in form
  router.post("/process-login", (req, res, next) => {

    // find a user document in the database with that user name
     UserModel.findOne({ username: req.body.loginUserName })
        .then((userFromDb) => {
          // if we didn't find a user
            if (userFromDb === null ) {
              // display the form again because the user name is worng
              res.locals.errorMessage = "You need a User Name to Log In";
              res.render("passport/login");

              // early return to stop the function since there an error
              // prevent the reset of the code running
              return;
            }

// console.log(req.body.loginPassword);
console.log(userFromDb.password);
            // is user name is correct now we check the password
         const isPasswordGood =
            bcrypt.compareSync(req.body.loginPassword, userFromDb.password);

            if (isPasswordGood === false){
              res.locals.errorMessage = "Password Incorrect or User Name";
              res.render("passport/login");

              // early return to stop the function since there an error
              // prevent the reset of the code running
              return;
            }

            // CREDENTIALS ARE GOOD! We need log the user IN

            //passport defines the "req.login()"
            // for us to specify when to log in a user intro the session
            req.login(userFromDb, (err) => {
              // check to see if the log in worked
              if (err) {
                // if it didn't show the error page
                next(err);
              } else {

                // redirect to home page on successful log in
                res.redirect("/");

              }
           }); // req.login()
        })// then()
        .catch((err) => {
          next(err);
        });
  });

  // LOG OUT session
  router.get("/logout", (req, res, next) => {
       // Passport defines the "req.logout" method
       // for  us to specify when to log out a user ( clear then from the session)
       req.logout();

       res.redirect("/");
  });



module.exports = router;
