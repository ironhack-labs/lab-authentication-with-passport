const {model, Schema} = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema (
  {
    username: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }

  )
  userSchema.plugin(PLM)
  module.exports = model('User', userSchema)