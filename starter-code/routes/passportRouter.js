const express        = require("express");
const router         = express.Router();
const passportController = require('../controllers/passport.controller');
const passport =require('../configs/passport.config');

router.get('/signup', passportController.signup);
router.post('/signup', passportController.doSignup);

router.get('/login', passportController.login);
router.post('/login', passportController.doLogin);

router.get('/logout', passportController.logout);

router.get('/private-page',passport.isAuthenticated, passportController.ensureLoggedIn);
// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


module.exports = router;
