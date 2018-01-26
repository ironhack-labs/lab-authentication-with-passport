const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");

module.exports.signup = (req, res, next) => {

    res.render('passport/signup',{ user: req.user });
  }
 }

 module.exports.doSignup = (req, res) => {
     User.findOne({ username: req.body.username })
         .then(user => {
             if (user != null) {
                 res.render('passport/signup', { user: req.body, error: { username: 'Username already exists'} })
             } else {
                 user = new User(req.body);
                 user.save()
                     .then(() => {
                         res.redirect('passport/login');
                     }).catch(error => {
                         if (error instanceof mongoose.Error.ValidationError) {
                             res.render('passport/signup', { user: user, error: error.errors })
                         } else {
                             next(error);
                         }
                     });
             }
         }).catch(error => next(error));
 }

 module.exports.privatePage = (req, res, next) => {
     
       res.render('passport/private'{ user: req.user });
     };

 }

 module.exports.doLogin = (req, res, next) => {
     const username = req.body.username;
     const password = req.body.password;
     if (!username || !password) {
         res.render('passport/login', {
             user: { username: username },
             error: {
                 username: username ? '' : 'Username is required',
                 password: password ? '' : 'Password is required'
             }
         });
     } else {
         User.findOne({ username: username})
             .then(user => {
                 errorData = {
                     user: { username: username },
                     error: { password: 'Invalid username or password' }
                 }
                 if (user) {
                     user.checkPassword(password)
                         .then(match => {
                             if (!match) {
                                 res.render('passport/login', errorData);
                             } else {
                                // console.log(req.session);
                                 req.session.currentUser = user;
                                 res.redirect('/');
                             }
                         })
                         .catch(error => next(error));
                 } else {
                     res.render('passport/login', errorData);
                 }
             }).catch(error => next(error));
     }
}

module.exports.logout = (req, res, next) => {
      req.session.destroy(error => {
          if (error) {
              next(error);
          } else {
              res.redirect("/login");
          }
      });
     /*req.session.currentUser = undefined;
     res.redirect("/login");*/
}

module.exports.index = (req, res, next) => {

  if (req.session.currentUser){
    res.render('index', {user: req.session.currentUser});
  }
  else {
    res.redirect("/login");
  }

}
