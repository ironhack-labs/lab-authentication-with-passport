const mongoose = require('mongoose');
// const createError =  require('http-errors');
const User = require('./../models/user.model');




// module.exports.get = (req, res, next) => {
//     const id = req.params.id;
//     User.findById(id)



module.exports.userCreate = (req, res, next) => {
    res.render('passport/signup');{
        user: new User()
    }
};

module.exports.userDoCreate = (req, res, next) => {
    const newUser = new User(req.body);
    console.log(newUser)
    User.findOne({username: newUser.username})
        .then(theUser => {
            if (theUser) {
                return res.render('users/login', {user: new User, errors: 'User exists'});
            } else {
                newUser.save()
                    .then(() => {
                        res.redirect('/passport/signup');
                    })
                    .catch(error => {
                        next();
                    })
            }
        })
};
