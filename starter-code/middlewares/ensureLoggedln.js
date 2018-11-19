const ensureLoggedIn = (redirectTo) => (req, res, next) => {
    if (req.user) {
      console.log(`ACCESS GRANTED to user ${req.user.username}`);
      next();
    } else {
      console.log(`ACCESS DENIED. No user, redirect!`);
      res.redirect(redirectTo);
    }
  };
  
  
  //const ensureLoggedIn = (redirectTo) => (req,res,next) => req.user ? next(): res.redirect(redirectTo)
  
  
  
  module.exports = ensureLoggedIn;
  