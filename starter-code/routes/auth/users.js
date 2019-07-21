const express = require("express");
const { isLogged, hasRole } = require("../../middlewares/auth");
const User = require("../../models/User");
const router = express.Router();

const ADMIN_ROLE = "Boss";

// CREATE
router.get("/add", isLogged, hasRole(ADMIN_ROLE), (req, res, next) => {
  const config = {
    formTitle: "Add a new user",
    action: "/users/add",
    buttonTitle: "Add user",
    password: true
  };
  res.render("auth/admin/userForm", config);
});
router.post("/add", isLogged, hasRole(ADMIN_ROLE), (req, res, next) => {
  const { username, role, name, bio, password } = req.body;

  User.register(
    {
      username,
      role,
      name,
      bio
    },
    password
  )
    .then(user => {
      res.redirect("/users/all");
    })
    .catch(err => {
      res.render("auth/admin/userForm", {
        message: err.message
      });
    });
});

//READ
router.get("/", isLogged, (req, res, next) => {
  const { internalRole: role } = req.user;

  User.find().then(docs => {
    const users = docs.filter(doc => doc.role !== ADMIN_ROLE);
    res.render(`auth/${role}/listView`, { users });
  });
});

//UPDATE
router.get("/edit", isLogged, (req, res, next) => {
  const { _id: id } = req.user;

  User.findById(id)
    .then(doc => {
      const config = {
        formTitle: `Update my information`,
        action: `/users/edit`,
        buttonTitle: "Update",
        //TODO: Help the user update passwords
        user: doc
      };

      res.render("auth/staff/userForm", config);
    })
    .catch(err => {
      res.send(err);
    });
});
router.post("/edit", isLogged, (req, res, next) => {
  const { _id: id } = req.user;
  const newUserInfo = req.body;

  User.findByIdAndUpdate(id, newUserInfo)
    .then(doc => {
      res.redirect("/profile");
    })
    .catch(err => {
      //TODO: Redirect with alert
      res.render("auth/staff/listView", { message: err.message });
    });
});

//READ
router.get("/:id", isLogged, (req, res, next) => {
  const { id } = req.params;
  User.findById(id).then(doc => {
    res.render("auth/staff/detailView", { user: doc });
  });
});

//UPDATE
router.get("/:id/edit", isLogged, hasRole(ADMIN_ROLE), (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then(doc => {
      const config = {
        formTitle: `Update the user: ${doc.username}`,
        action: `users/${id}/edit`,
        buttonTitle: "Update user",
        //TODO: Help the boss update user passwords
        password: false,
        user: doc,
        selected: {
          TA: doc.role === "TA",
          Developer: doc.role === "Developer"
        }
      };

      res.render("auth/admin/userForm", config);
    })
    .catch(err => {
      //TODO: Redirect with alert
      res.redirect("/users/all");
    });
});
router.post("/:id/edit", isLogged, hasRole(ADMIN_ROLE), (req, res, next) => {
  const { id } = req.params;
  const newUserInfo = req.body;

  User.findByIdAndUpdate(id, newUserInfo)
    .then(doc => {
      res.redirect("/users/all");
    })
    .catch(err => {
      //TODO: Redirect with alert
      res.render("auth/admin/listView", { message: err.message });
    });
});

//DELETE
router.get("/:id/delete", isLogged, hasRole(ADMIN_ROLE), (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then(doc => {
      res.redirect("/users/all");
    })
    .catch(err => {
      //TODO: Redirect with alert
      res.render("auth/admin/listView", { message: err.message });
    });
});

module.exports = router;
