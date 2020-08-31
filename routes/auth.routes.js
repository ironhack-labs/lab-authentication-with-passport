const express = require('express');
const router = express.Router();
const { ensureLogin } = require("../middleware")
const {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  getPrivate,
  logout
} = require("../controllers/auth");


router.get("/auth/signup", getSignUp);
router.post("/auth/signup", postSignUp);

router.get("/auth/login", getLogin);
router.post("/auth/login", postLogin);

router.get("/auth/private", ensureLogin("/fail"), getPrivate);

router.get("/auth/logout", logout);

module.exports = router;
