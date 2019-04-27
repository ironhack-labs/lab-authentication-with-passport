
const express = require('express');
const passportRouter = express.Router();

const ensureLogin = require('connect-ensure-login');
const passportController = require('../controllers/passport.controller');

//passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), passportController) 

passportRouter.get('/signup', passportController.signUpForm);
passportRouter.post('/signup',passportController.signupCreate);

passportRouter.get('/login', passportController.loginForm);
passportRouter.post('/login', passportController.loginAccess)

module.exports = passportRouter;