const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { model, Schema } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User
userSchema.plugin(PLM, { usernameField: 'email' })

module.exports = model('User', userSchema)
