const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const {signupView,
    signupProcess,
    loginView,
    loginProcess,
    private,
    logout}  = require("../control/index")

const {enssureLogin} =  require("../middlewares")

//signUp
router.get("/auth/signup", signupView)
router.post("/auth/signup", signupProcess)

// //login
router.get("/auth/login", loginView)
router.post("/auth/login", loginProcess)
router.get("/logout", logout)

//private
router.get("/auth/private", enssureLogin("/auth/login"), (req, res)=>{
  res.render("auth/private", {user : req.user})
})


module.exports = router;
