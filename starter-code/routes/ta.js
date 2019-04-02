const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAuth = require("../helpers/isAuth");
const checkRoles = require("../helpers/checkRoles");
const ObjectID = require("mongodb").ObjectID;

// Middleware setup
router.use(isAuth);
router.use(checkRoles("TA"));

router.get("/private", (req, res) => {
  const { user } = req;
  // to omit the logged user on query
  const loggedUser = new ObjectID(user._id);
  User.find({ _id: { $ne: loggedUser } })
    .then(users => {
      res.render("ta/index", { user, users });
    })
    .catch(err => {
      console.log(`Error recuperando usuarios durante carga de perfil de TA`);
      console.log(err);
      res.redirect("/private");
    });
});

router.get("/profile", (req, res) => {
  const { user } = req;
  res.render("ta/profile", { user, edit: true });
});

router.get("/:id/profile", (req, res) => {
  const { id } = req.params;
  User.findById(id).then(user => {
    res.render("ta/profile", { user });
  });
});

router.post("/:id/update", (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, { $set: { ...req.body } }, { new: true }).then(
    user => {
      res.render("ta/profile", { user });
    }
  );
});

module.exports = router;
