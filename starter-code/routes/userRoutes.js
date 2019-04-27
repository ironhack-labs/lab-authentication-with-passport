const express = require('express');
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

const users = require('../controllers/user.controller');

router.get('/', ensureLogin.ensureLoggedIn(), users.access);
router.get('/private-page', ensureLogin.ensureLoggedIn(), users.privatePage);

module.exports = router;