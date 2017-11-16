const mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/passport-users", {useMongoClient: true})
  .then(() => {
    console.log("Mongoose SUCCESS");
  })
  .catch((err) => {
    console.log("Mongoose FAILED");
    console.log(err);
  });
