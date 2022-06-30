const mongoose = require("mongoose");


const User = require("../models/User.model");

require("dotenv/config");

const mongouri = process.env.MONGODB_URI;

mongoose
  .connect(mongouri)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));
