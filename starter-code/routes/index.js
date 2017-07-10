var express = require('express');
var router = express.Router();
const ensureLogin = require("connect-ensure-login");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/private-page", ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
