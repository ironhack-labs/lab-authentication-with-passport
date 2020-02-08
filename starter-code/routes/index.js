const express = require("express");
const router = express.Router();
const passportRouter = require("./passportRouter");

router.use("/signup", passportRouter);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
