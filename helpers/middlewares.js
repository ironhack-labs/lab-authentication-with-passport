
// this is a middleware
let loggedInUser = (req, res, next) => {
    // req.user // passport makes this available 
    if (req.user) {
      next()
    } else {
      req.flash('message', 'You have to be logged in to view this page')
      req.flash('message', 'this is Message 2')
      res.redirect('/login?redirectBackTo=' + req.path)
      //res.send('test')
    }
  }
  
  let userIsAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
      next()
    } else {
      res.send('you need to be admin to view this page')
    }
  }
  
  module.exports = { loggedInUser: loggedInUser, userIsAdmin: userIsAdmin }