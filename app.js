// jshint esversion:6

require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

// // REQUIRE (WHAT SHOULD BE HERE AND WHAT SHOULD NOT???)
// const router = express.Router();
const User = require("./models/User.model.js"); // ERROR: ../models/User.model.js
const bcrypt = require("bcrypt");
// const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const ensureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

mongoose
  .connect("mongodb://localhost/auth-with-passport", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// NEW MIDDLEWARE SETUP
app.use(
  session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true,
  })
);

// The following code **needs to be placed before the passport.initialize() function.
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(flash());

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(null, false, { message: "Incorrect username" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: "Incorrect password" });
        }

        return next(null, user);
      });
    }
  )
);

// SLACK SOCIAL LOGIN
passport.use(
  new SlackStrategy(
    {
      clientID: "2432150752.1092216985457",
      clientSecret: "335de9c82a5e629b72f48b19a18497d8",
      callbackURL: "/auth/slack/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Slack account details:", profile);

      User.findOne({ slackID: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ slackID: profile.id })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);

// GOOGLE SOCIAL LOGIN
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "678605333721-7h7bksoo8ghc7j6u2j9jn3np8drl7g7n.apps.googleusercontent.com",
      clientSecret: "d7U03Rw5_j4PWycHZlIicW4j",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ googleID: profile.id })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// Routes middleware goes here
const index = require("./routes/index.routes.js");
app.use("/", index);

const authRoutes = require("./routes/auth.routes.js");
app.use("/", authRoutes);

module.exports = app;
