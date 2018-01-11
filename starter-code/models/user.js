const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.Promise = global.Promise;



const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "username"});

const User = mongoose.model("User", userSchema);
module.exports = User;
