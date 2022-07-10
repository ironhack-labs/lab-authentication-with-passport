require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");

const logger = require("morgan");
const path = require("path");
const flash = require("connect-flash");

//const bcrypt = require("bcrypt");
const app_name = require("./package.json").name;
// passport config
const User = require("./models/User.model");
require("./db");


const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// connected flash setup
app.use(flash());

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// session configuration
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
// end of session configuration

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(passport.authenticate('session'));

// register the local strategy (authentication using username and password)
passport.use(
  new LocalStrategy((username, password, done) => {
    // this logic will be executed when we log in
    User.findOne({ username: username }).then((user) => {
      if (user === null) {
        // username is not correct
        done(null, false, { message: "Wrong Credentials" });
      } else {
        done(null, user);
      }
    });
  })
);

// Github strategy

const GithubStrategy = require('passport-github').Strategy

passport.use(new GithubStrategy({
	clientID: process.env.ID,
	clientSecret: process.env.SECRET,
	callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
},
	(accessToken, refreshToken, profile, done) => {
		console.log(profile)
		User.findOne({
			githubId: profile.id
		})
			.then(user => {
				if (user !== null) {
					// pass the user to passport to serialize it
					done(null, user)
				} else {
					// we don't have this user in the db so we create it
					User.create({
						githubId: profile.id,
						username: profile.username,
						avatar: profile._json.avatar_url
					})
						.then(user => {
							done(null, user)
						})
				}
			})
	}))

// end of Github strategy



app.use(passport.initialize());
app.use(passport.session());

// Routes middleware goes here
// const { loginOut } = require("./routes/middleware");
// app.use("/", loginOut);

const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

module.exports = app;
