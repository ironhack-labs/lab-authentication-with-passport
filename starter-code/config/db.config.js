require("dotenv").config();
const dbUrl = process.env.DBURL;
const mongoose = require("mongoose");

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

module.exports = mongoose;
