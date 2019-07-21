const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    name: String,
    bio: String,
    role: {
      type: String,
      required: true,
      enum: ["Boss", "TA", "Developer", "Alumni"]
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
