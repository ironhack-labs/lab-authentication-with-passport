//mongoose configuration
const mongoose = require('mongoose');
const DB_NAME = 'lab-authentication-with-passport';
const MONGO_URI = `mongodb://localhost/${DB_NAME}`;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to ${DB_NAME} database.`);
    })
    .catch((error) => {
        console.log(`Database connection error: ${error}`);
    })