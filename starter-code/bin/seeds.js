const mongoose = require("mongoose");
const Auth = require("../models/user");

mongoose.connect("mongodb://localhost/passport-local").then(() => console.log("Conectado"));

const auth = [
    {
        username: 'Jr',
        password: "111"
    },
]

Auth.collection.drop();

auth.forEach(c => {
    let au = new Auth(c);
    au.save((err, auth) => {
        if (err) {
            throw err;
        }
        console.log(`User saved ${auth.username}`);
        // mongoose.disconnect();
    })
});