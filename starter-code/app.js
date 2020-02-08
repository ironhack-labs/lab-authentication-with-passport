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
const flash = require("flash");
const { setLog } = require("@faable/flogg");
setLog("express-passport");

const dbUrl = process.env.DBURL;

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: ${dbUrl}`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

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

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(flash());

require("./passport")(app);

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
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.user = req.user;
  if (req.user) {
    // User exists
    req.user.visitas += 1;
    req.user.save();
  }
  res.locals.errors = req.session.flash.map(e => e.message);
  next();
});

// default value for title local
app.locals.title = "BUSES SUR: El sur nunca estuvo lejos";

// Routes middleware goes here
const index = require("./routes/index");
app.use("/", index);

const passportRouter = require("./routes/passportRouter");
app.use("/", passportRouter);

module.exports = app;
