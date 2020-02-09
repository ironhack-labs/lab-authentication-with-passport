const express = require("express");
const router = express.Router();
const signup = require("./signup");
const login = require("./login");
const profile = require("./profile");

router.use("/signup", signup);
router.use("/login", login);
router.use("/profile", profile);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { home: true });
  console.log(req.user);
});

module.exports = router;
