const express = require('express');
const router = express.Router();
const {signupView, signupProcess, loginView, loginProcess, privatePage, logout}= require("../controllers/auth");
const { isAuth, isNotAuth, checkRoles } = require("../middlewares")

/* GET home page */
router.get('/', (req, res) => res.render('index'));


//Auth
router.get('/signup', isNotAuth, signupView)
 router.post('/signup', isNotAuth, signupProcess)
router.get('/login', isNotAuth, loginView)
router.post('/login', isNotAuth, loginProcess)

router.get('/private', isAuth, privatePage)
router.get("/logout", logout)

module.exports = router;
