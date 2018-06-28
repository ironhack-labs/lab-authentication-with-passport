const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  encryptedPassword : {type : String, requiered : true}
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;