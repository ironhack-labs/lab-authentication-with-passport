const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  //password: String //Se quita para que no aparezca en la base de datos.
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("User", userSchema);

module.exports = User;