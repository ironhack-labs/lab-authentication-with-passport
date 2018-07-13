const mongoose = require('mongoose');
const User = require('../models/user.model');

require('../configs/db.config');

const Users = require('../data/users.data');
mongoose.connection.close();

User.insertMany(Users)
    .then(data => {
        console.log('User created!')
        mongoose.connection.close();
    })
    .catch(error => {
        console.error(error,'Something is wrong')
        mongoose.connection.close();
    })

