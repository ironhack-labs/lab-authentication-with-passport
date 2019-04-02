const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const isAuth = require("../helpers/isAuth");
const checkRoles = require("../helpers/checkRoles");

router.use(isAuth);
router.use(checkRoles("TA"));

router.get("/", (req, res) => {
  const { user } = req;
  Course.find().then(courses => {
    res.render("course/index", { courses, user });
  });
});

router.get("/newcourse", (req, res) => {
  const { user } = req;
  res.render("course/form", { user });
});

router.post("/newcourse", (req, res) => {
  Course.create(req.body).then(() => {
    res.redirect("/course");
  });
});

router.get("/:id/detail", (req, res) => {
  const { user } = req;
  const { id } = req.params;
  Course.findById(id).then(course => {
    if (course) {
      return res.render("course/detail", { course, user });
    } else {
      res.redirect("/course");
    }
  });
});

router.get("/:id/edit", (req, res) => {
  const { user } = req;
  const { id } = req.params;
  Course.findById(id).then(course => {
    if (course) {
      const { category, model } = course;
      let optCat1 = false,
        optCat2 = false,
        optMod1 = false,
        optMod2 = false;
      switch (category) {
        case "Web Development":
          optCat1 = true;
          break;
        case "UX/UI":
          optCat2 = true;
          break;
      }
      switch (model) {
        case "Full Time":
          optMod1 = true;
          break;
        case "Part Time":
          optMod2 = true;
          break;
      }
      return res.render("course/form", {
        course,
        optCat1,
        optCat2,
        optMod1,
        optMod2,
        user
      });
    } else {
      res.redirect("/course");
    }
  });
});

router.post("/:id/update", (req, res) => {
  const { id } = req.params;
  Course.findByIdAndUpdate(id, { $set: { ...req.body } }).then(() => {
    res.redirect("/course");
  });
});

router.post("/:id/delete", (req, res) => {
  const { id } = req.params;
  Course.findByIdAndRemove(id).then(() => {
    res.redirect("/course");
  });
});

module.exports = router;
