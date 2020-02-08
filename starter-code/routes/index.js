const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const passportRouter = require("./passportRouter");
router.use("/auth", passportRouter);

module.exports = router;
