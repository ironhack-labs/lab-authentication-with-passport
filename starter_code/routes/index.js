const express = require('express');
const router  = express.Router();
const passport       = require("passport");
const LocalStrategy  = require('passport-local').Strategy;
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});




module.exports = router;
