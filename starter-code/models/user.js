const { model, Schema } = require("mongoose");
const PLM = require("passport-local-mongoose");

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

userSchema.plugin(PLM, { usernameField: "email" });

module.exports = model("User", userSchema);