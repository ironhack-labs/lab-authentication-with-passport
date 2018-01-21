const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;

module.exports.setup = (passport) => {
  //passport recupera un modelo de mongoose, antes con la cokkie de sesion era un Json
  //guardar ususario en cookie
  //Esto es la creacion de la cookie
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  //usar la cookie de un determinado usuario id
  passport.deserializeUser((id, next) => {
    User.findById(id)
      .then(user => {
        next(null, user);
      })
      .catch(error => next(error));
  });
  //usuario y contraseña
  passport.use('local-auth', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, next) => {
    User.findOne({
        username: username
      })
      .then(user => {
        if (!user) {
          //next de passport mirar documentacion
          next(null, null, {
            password: "invalid username of password"
          });
        } else {
          user.checkPassword(password)
            .then(match => {
              if (match) {
                //next de passport mirar documentacion
                next(null, user);
              } else {
                //next de passport mirar documentacion
                next(null, null, {
                  password: "invalid username of password"
                });
              }
            })
            .catch(error => next(error));
        }
      }).catch(error => next(error));
  }));
};

//esto estaba en secure.config.js que hemos eliminado
module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};