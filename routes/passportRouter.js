const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensure = require("connect-ensure-login");
const passport      = require("passport");

const whoRoute = express.Router();

whoRoute.get('/', (req, res, next)=>{
  res.render('signup.ejs');
});

whoRoute.get('/signup',
  //redirects to '/' if you ARE logged in
  ensure.ensureNotLoggedIn('/'),

(req, res, next) => {
//IF WE DIDNT USE CONNECT-ENSURE-LOGIN we would have to do this to avoid people login where they are not supposed to by typin web addresses
  // if(req.user) {
  //   res.redirect('/');
  //   return;
  // }
  res.render('passport/signup.ejs');
});



whoRoute.post('/signup',
  ensure.ensureNotLoggedIn('/'),(req, res, next) => {
  const signupUsername = req.body.signupUserName;
  const signupPassword = req.body.signupPassword;

//DONT LET USERS SUBMIT BLANK USERNAMES OR PASSWORDS
  if (signupUsername ==='' || signupPassword ===''){
    res.render('passport/signup.ejs', {
      errorMessage: 'Please provide both username and password'
    });
    return;
  }



User.findOne(
  {username: signupUsername},
  {username: 1},
  (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (foundUser) {
      res.render('passport/signup.ejs', {
        errorMessage: 'Username is taken, sir or madam'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(signupPassword, salt);

    const theUser = new User({
      name: req.body.signupName,
      username: signupUsername,
      encryptedPassword: hashPass
    });

    theUser.save((err) => {
      if (err) {
        next(err);
        return;
      }

      res.redirect('/');
      });
    }
  );
  User.findOne(
    // 1st argument -> criteria of the findOne (wich documents)
    {username: signupUsername},
    // 2nd arg -> projection (which fields to give us)
    {username: 1},
    // 3rd arg -> callback
    (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

        //Don't let the user register if the usename is taken
      if (foundUser) {
        res.render('passport/signup.ejs', {
          errorMessage: 'Username is taken, sir or madam'
        });
        return;
      }
});
});


whoRoute.get('/login',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
  res.render('passport/login.ejs');
});

//<form method="post" action="/login">
whoRoute.post('/login',
    //redirect to homepage '/' ig you are logged in
    ensure.ensureNotLoggedIn('/'),

  //................. ... local AS IN 'LocalStrategy'(our methofd of logging in)
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  } )
);

whoRoute.get('/logout', (req, res, next) => {
  //req.logout() method provided by Passport
  req.logout();

  res.redirect('/');
});



whoRoute.get("/private-page", ensure.ensureLoggedIn('/'), (req, res) => {
  res.render("passport/private", { user: req.user });
});




module.exports = whoRoute;
