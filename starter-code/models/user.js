const { Schema, model } = require("mongoose")

const PLM = require("passport-local-mongoose")

const userSchema = new Schema(
  {
    username: String
  },
  {
    timestamps: true,
    versionKey: false
  }
)
userSchema.plugin(PLM)

module.exports = model("User", userSchema)
