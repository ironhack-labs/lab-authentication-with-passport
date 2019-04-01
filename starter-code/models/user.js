const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");




const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});


userSchema.plugin(passportLocalMongoose, {
  usernameField:"email",
  hashField:"password"
})

const User = mongoose.model("User", userSchema);
module.exports = User;