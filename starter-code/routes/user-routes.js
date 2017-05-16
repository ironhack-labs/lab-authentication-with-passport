const express    = require("express");
const bcrypt     = require('bcrypt');
const passport   = require('passport');
const User       = require("../models/user-model.js");
const ensure     = require('connect-ensure-login');

const userRoutes = express.Router();

userRoutes.get('/user-home',

  //redirects to '/login' if you are NOT logged in
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    console.log('\n');
    console.log('USER HOME PAGE ************************************');

    console.log('\n');
    console.log('SESSION (from express-session middleware)*****');
    console.log(req.session);

    console.log('\n');
    console.log('USER (from Passport middleware)***************');
    console.log(req.user); 
    console.log('\n');
    
    res.render('user/user-home-view.ejs', {
      successMessage: req.flash('success')
    });
  }
);










module.exports = userRoutes;