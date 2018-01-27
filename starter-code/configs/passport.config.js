const User  = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;


 module.exports.setup = (passport) => {
     passport.serializeUser((user, next) => {
         next(null, user._id);
     });

     passport.deserializeUser((id, next) => {
         User.findById(id)
         .then(user => {
             next(null,user);
         })
         .catch(error => next(error));
     });

  passport.use('local-auth', new LocalStrategy({
     usernameField: 'username',
     passwordField: 'password'
     }, (username, password, next) => {
     console.log(username);
     User.findOne({ username: username })
         .then(user => {
             if (!user) {
                 next(null, null, { password: 'Invalid username or password' })
             } else {
                 user.checkPassword(password)
                     .then(match => {
                         if (match) {
                             next(null, user);
                         } else {
                             next(null, null, { password: 'Invalid username or password' })
                         }
                     })
                     .catch(error => next(error));
             }
         }).catch(error =>
             next(error));
     }));

 }

 module.exports.isAuthenticated = (req, res, next) => {
     console.log(req.isAuthenticated);
     if (req.isAuthenticated) {
         next();
     } else {
         res.redirect('/login');
     }
 }
