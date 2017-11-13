const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

//Crear la ruta para la vista signup
router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

//Recoger los datos con el post
router.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  //Si la contraseña o el usuario están vacíos
  if(username === '' || password === ''){
    res.render('passport/signup', {
      errorMessage: 'Indicate username or password'
    });
    return;
  }

  //Buscamos al usuario para comprobar si ya existe
  User.findOne({'username': username}, 'username', (err, user) => {
    if(user !== null){
      res.render('passport/signup', {
        errorMessage: 'The user already exists'
      });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass,
    });

    //Guardamos los datos del formulario en la BBDD
    newUser.save((err) => {
      if(err) {
        res.render('passport/signup', {
          errorMessage: 'Something went wrong'
        });
      } else{
        res.render('passport/login');
      }
    });
  })
});

//Ruta para login
router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});






module.exports = router;
