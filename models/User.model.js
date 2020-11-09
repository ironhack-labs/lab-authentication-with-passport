const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    unique: true,
    require: true
  }
}, {
  timestamps: true
});

module.exports = model("User", userSchema);