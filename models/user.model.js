const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['ADMIN', 'EDITOR', 'GUEST'],
        default: 'GUEST'
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User
