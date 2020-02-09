const express = require("express");
const router = express.Router();
const signup = require("./signup");
const login = require("./login");

router.use("/signup", signup);
router.use("/login", login);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { home: true });
});

module.exports = router;
