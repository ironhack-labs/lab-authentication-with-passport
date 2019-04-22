const express = require('express');
const router  = express.Router();
const ensureLogin = require('connect-ensure-login')
const passport = require("passport")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const localStrategy = require("passport-local").Strategy;


router.get('/', (req, res, next) => {
  res.render('index');
});
 
router.get('private-page',
ensureLogin.ensureLoggedIn(),
(req, res)=> {
  req.render('private', {user:req.user})
})

module.exports = router;
