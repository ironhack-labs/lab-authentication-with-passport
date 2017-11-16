const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");
//const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");

const passportConfig = require("./helpers/passport");
const index = require("./routes/index");
const users = require("./routes/users");
const auth = require("./routes/auth");
const User = require("./models/user");

var app = express();

// mongoose connect
mongoose.connect("mongodb://localhost:27017/Auth-PP", {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// -- middleware setup

app.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  })
);

passportConfig();
//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -- routes

app.use("/", index);
app.use("/", users);
app.use("/", auth);

// -- 4040 and global error handler

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
