const mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/passport-auth", { useMongoClient: true})
    .then( () => {
        console.log("Mongoose is connected!");
    })
    .catch( (err) => {
        console.log("Mongoose connection FAILED! 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
        console.log(err);
    });
