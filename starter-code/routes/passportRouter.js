const express        = require("express");
const router         = express.Router();
const passportController = require('../controllers/passport.controller');

router.get('/private-page', passportController.ensureLoggedIn);
router.get('/signup', passportController.signup);
router.post('/signup', passportController.doSignup);

router.get('/login', passportController.login);
router.post('/login', passportController.doLogin);


// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


module.exports = router;
