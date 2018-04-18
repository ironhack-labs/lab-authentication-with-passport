const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/process-signup", (req, res, next) => {
  const {username, password} = req.body;

  if (password === "" || password.match(/[0-9]/) === null){
    // "req.flash()" is defined by the "flash" package
    // req.flash("error", "Your password must have at least one number");
    res.redirect("/signup");
    return;
}

const salt = bcrypt.genSaltSync(10);
const encryptedPassword = bcrypt.hashSync(password, salt);
console.log(encryptedPassword);

User.create({username, encryptedPassword})
    .then(() => {
         // "req.flash()" is defined by the "flash" package
        // req.flash("success", "You have signed up! Try logging in.");
        res.redirect("/");
    })
    .catch((err) => {
        next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/process-login", (req, res, next) => {
  console.log("hey")
  const {username, password} = req.body;

  console.log(password);
  User.findOne({username})
      .then((userDetails) => {
        console.log("Je suis là")
          if (!userDetails){
              // req.flash("error", "Wrong email.");
              res.redirect("/login");
              return;
          } 
          console.log(userDetails);
          const {encryptedPassword} = userDetails;

          console.log(encryptedPassword);
          if (!bcrypt.compareSync(password,encryptedPassword )){
              // req.flash("error", "Wrong password");
              res.redirect("/login");
              return;
          } 
          
          // "req.login()" is Passport's method for logging a user in
          // req.flash("success", "Log in successful!");
          req.login((userDetails), () => {
            res.redirect("/");
          });
          
      })
      .catch((err) => {
          next(err);
      });
});

router.get("/logout", (req, res, next) => {
  // "req.logout()" is Passport's method for logging a user OUT
  req.logout();
  // req.flash("success", "Log out successful!");
  res.redirect("/");
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = router;