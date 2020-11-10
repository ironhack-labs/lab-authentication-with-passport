const express = require('express'),
  router = express.Router(),
  chalkAnimation = require('chalk-animation'),
  app = express(),
  bcrypt = require("bcrypt"),
  User = require("../models/User.model.js"),
  passport = require("../config/passport");
// Require user model

// Add bcrypt to encrypt passwords

// Add passport
router.use(passport.initialize());
router.use(passport.session());
// Add the line below, which you're missing:
// require('./path/to/passport/config/file')(passport);

const ensureLogin = require('connect-ensure-login');
//Add a new GET route to your routes/auth.routes.js file with the path /signup and point it to your views/auth/signup.hbs file.
router.get('/private-page',  (req, res) => {
  res.render('auth/private', {
    user: req.user
  });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});
// add a POST route to your routes/auth.routes.js to receive the data from the signup form and create a new user with the data.
router.post('/signup', (req, res) => {
  // console.log(req.body);
  const {
    username,
    password
  } = req.body
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  let user = User.create({
    username: username,
    password: hashPass
  })



  res.render('auth/login', {
    user
  });
  // console.log(user);
});

// create a GET route that will display the login form. Create a login form in the views/auth/login.hbs
router.get('/login', (req, res) => {
  res.render('auth/login');
});
//Create a login form in the views/auth/login.hbs. The form should make a POST request to /login
router.post('/login',
  passport.authenticate(
    'local', {
      successRedirect: "/private-page",
      failureRedirect: "/login"
    })
);

//Once you have the form, add another route to the router. This route needs to receive the data from the form and log the user in.


module.exports = router;

// app.listen(3000, () => chalkAnimation.rainbow('running on port 3000  🔊'));
