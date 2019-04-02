const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: String,
    nickname: {
      type: String,
      default: "Ironhacker"
    },
    role: {
      type: String,
      enum: ["BOSS", "TA", "DEV"],
      default: "DEV"
    }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField:"email",
  hashField:"password"
})

const User = mongoose.model("User", userSchema);
module.exports = User;