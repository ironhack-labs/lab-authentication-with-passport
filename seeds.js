const mongoose = require("mongoose");

const User = require("./models/User.model");

require("dotenv/config");

const mongouri = process.env.MONGODB_URI;

mongoose.connect(mongouri);
