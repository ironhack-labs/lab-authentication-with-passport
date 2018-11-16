const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const CelebritySchema = new Schema({
  firstName: String,
  lastName: String,
  nationality: String,
  birthday: Date,
  pictureUrl: String
});

const Celebrity = mongoose.model("Celebrity", CelebritySchema);

module.exports = Celebrity;