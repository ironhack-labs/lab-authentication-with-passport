const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  username: String
}, {
  timestamps: true,
  versionKey: false

});
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'})

const User = mongoose.model("User", userSchema);
module.exports = User;