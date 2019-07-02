  const User = require('../models/user')
  const { genSaltSync, hashSync } = require('bcrypt')
 

  exports.getSignup = (req, res) => {
    res.render('passport/signup')
  }

  exports.postSignup = async (req, res) => {
    const { username, password } = req.body
    const salt = genSaltSync(10)
    const hashPassword = hashSync(password, salt)
    const user = await User.findOne({ username })

    if(username === '' || password === ''){
      return res.render('/passport/signup', {
        message: 'Empty username or password'
      })
    }
  
    if(user !== null){
      return res.render('/passport/signup', {
        message: 'The username already exists'
      })
    }
  
    await User.create({ username, password: hashPassword })
    res.redirect('/passport/login')
  }

  exports.getLogin = (req, res) => {
    req.render('/passport/login')
  }


