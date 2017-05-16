const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// define the Schema with username and password
const userSchema = new Schema({
  firstName          : { type : String },
  lastName           : { type : String },
  username           : { type : String },
  encryptedPassword  : { type : String },
  // social login strategy
  facebookId         : { type : String },
  googleId           : { type : String }
}, 
{
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;