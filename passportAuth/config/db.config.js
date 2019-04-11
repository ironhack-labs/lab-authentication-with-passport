const mongoose = require('mongoose')
const MONGO_URI = 'mongodb://localhost/passportAuth'


mongoose
  .connect(MONGO_URI, { useCreateIndex: true, useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
