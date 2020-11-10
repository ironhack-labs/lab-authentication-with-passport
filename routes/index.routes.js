const express = require('express');
const router = express.Router();
const passport = require("../config/passport")

const {
    signupView,
    signupProcess,
    loginView,
    loginProcess,
    privatePage,
    logout,
    gatekeeperPage,
    adminPage,
    normiePage
  } =require("../controllers/authcontr")
  
/* GET home page */
router.get('/', (req, res) => res.render('index'));
router.get("/signup", isNotAuth, signupView)
router.post("/signup", isNotAuth, signupProcess)
router.get("/login", isNotAuth, loginView)

//auth middleware 
router.post("/login", isNotAuth, loginProcess)
router.get("/private-page", isAuth, privatePage)



module.exports = router;
