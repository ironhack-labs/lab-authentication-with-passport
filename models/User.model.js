const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

//npm mongoose-findorcreate
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
  username: String,
  password: String,
  githubId: String,
  githubName: String,
  slackId: String
}, {
  timestamps: true
});

//npm mongoose-findorcreate
userSchema.plugin(findOrCreate);



const User = mongoose.model("User", userSchema);
module.exports = User;