require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const User = require("./models/user");

mongoose.Promise = Promise;
mongoose
    .connect(
        "mongodb://localhost/passport-local",
        { useMongoClient: true }
    )
    .then(() => {
        console.log("Connected to Mongo!");
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Sessions

app.use(
    session({
        secret: "our-passport-local-strategy-app",
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Saves Logged in User Session in Cookie
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

// Make sure NOT to save Password
passport.deserializeUser((id, cb) => {
    // id = Session id, saved in cookie!
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }

        const cleanUser = user.toObject();
        delete cleanUser.password;

        cb(null, cleanUser);
    });
});

// Compare Typed in password with encrypted password from database
// and handle results
passport.use(
    new LocalStrategy(function(username, password, done) {
        User.findOne({ username }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }

            if (!user.password) {
                return done(null, false, {
                    message: "Password not set, please contact support or log in with social."
                });
            }

            const passwordsMatch = bcrypt.compareSync(password, user.password);
            if (!passwordsMatch) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        });
    })
);

// Express View engine setup

app.use(
    require("node-sass-middleware")({
        src: path.join(__dirname, "public"),
        dest: path.join(__dirname, "public"),
        sourceMap: true
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
const passportRouter = require("./routes/passportRouter");
app.use("/", index);
app.use("/", passportRouter);

module.exports = app;
