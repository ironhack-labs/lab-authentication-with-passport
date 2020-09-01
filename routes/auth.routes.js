const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const {
  signupView,
  signupProcess,
  loginProcess,
  loginView,
  private
} = require("../controllers/auth")

const { enssureLogin } = require("../middlewares")

router.get("/signup", signupView)
router.post("/signup", signupProcess)

router.get("/login", loginView)
router.post("/login", loginProcess)


router.get("/private", enssureLogin("/"), private)

module.exports = router;
