const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  user: String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(PLM,{usernameField:'user'})
module.exports = mongoose.model("User", userSchema);
