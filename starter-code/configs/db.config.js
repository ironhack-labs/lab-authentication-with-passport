const mongoose = require('mongoose');
const DB_NAME = 'authentication-with-passport';

mongoose
  .connect(`mongodb://localhost/${DB_NAME}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
