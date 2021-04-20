module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    },
    isLoggedOut: (req, res, next) => {
        if(req.isAuthenticated()) {
            res.redirect('/auth/private');
        } else {
            next();
        }
    }
}