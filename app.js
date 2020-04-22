require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

// Iteration 1:
const User = require("./models/User.model");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

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

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// passport:
app.use(
  session({
    secret: "pLeAsE-EnTeR-sEcReT",
    resave: true,
    saveUninitialized: true,
  })
);

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((found) => next(null, found))
    .catch((error) => {
      console.log(error);
      next();
    });
});

app.use(flash());
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (request, username, password, next) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return next(null, false, { message: "Incorrect username" });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: "Incorrect password" });
          }
          return next(null, user);
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  )
);

// Bonus: Social Login
// see lecture instructions
const SlackStrategy = require("passport-slack").Strategy;

passport.use(
  new SlackStrategy(
    {
      clientID: "1012534720640.1091954637505",
      clientSecret: "a10680ea274740d72bd0476a16eef92b",
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
            .catch((error) => {
              done(error);
            }); // closes User.create()
        })
        .catch((error) => {
          done(error);
        }); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Routes middleware goes here
const index = require("./routes/index.routes");
app.use("/", index);
const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

module.exports = app;

app.listen(3000, () => {
  console.log("Running on port 3000!");
});
