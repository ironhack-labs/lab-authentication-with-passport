const mongoose = require("mongoose");

const Schema   = mongoose.Schema;

// new Schema({ schema },{ setting })
const userSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
  username: {
    type: String
  },
  password: {
    type: String
  }
 },

 // 2nd argument -> SETTING object

  {
  // automatially add " createAt" and "updateAt" Date fields
  timestamps: true
  }
 );

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
