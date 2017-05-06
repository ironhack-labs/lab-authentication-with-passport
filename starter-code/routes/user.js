const express = require('express');
const ensure = require('connect-ensure-login');
const routerThingy = express.Router();


routerThingy.get('/profile/edit',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    res.render('user/edit-profile.ejs');
  }
);

module.exports = routerThingy;
