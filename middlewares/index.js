exports.isNotAuth = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
};
exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};