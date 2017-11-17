const express = require("express");


const router = express.Router();

router.get("/settings", (req, res, next) => {
  if (req.user === undefined){
      res.redirect("/login");

      return;
  }
  res.render("passport/settings-page.ejs");
});

module.exports = router;
