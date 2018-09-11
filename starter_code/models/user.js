const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema({
  username: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

function validateUser(userData) {
    let user = {
        username: Joi.string().required(),
        password: Joi.string().required()
    };

    let result = Joi.validate(userData, user);
    let { error } =  result;

    return error;

}

module.exports = {
    User,
    validateUser
};