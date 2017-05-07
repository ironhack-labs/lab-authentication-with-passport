const express = require('express');
const ensure = require('connect-ensure-login');

const routerThingy = express.Router();

routerThingy.get('/passport/private',

ensure.ensureLoggedIn('/login'),

(req, res, next) => {
  // if(!req.user){
  //   res.redirect('/login');
  //   return;
  // }
  res.render('passport/private.ejs');
}
);

module.exports = routerThingy;
