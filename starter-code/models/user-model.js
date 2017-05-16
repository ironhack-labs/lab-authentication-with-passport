const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
    name:{type:String},
    username:{type:String},
    encryptedPassword:{type:String},

    //Login with facebook
    
    //Login with google

    },
//second argument are additional options
    {
    //adds createdAt and updatedAt to documents

    timestamps: true

    }
);
const User = mongoose.model('User',userSchema);
module.exports = User