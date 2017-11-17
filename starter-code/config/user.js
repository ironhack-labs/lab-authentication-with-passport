const mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/passport", {useMongoClient: true})
.then(() => {
  console.log("Mongoose is connected🤪🤪🤪");
})
.catch((err) => {
  console.log("Mongoose conecction FAILED!!!🧐");
  console.log(err);
});
