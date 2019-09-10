'use strict';

module.exports = (req, res, next) => {
  if (!req.user) {
    res.redirect('/authentication/sign-in');
  } else {
    next();
  }
};