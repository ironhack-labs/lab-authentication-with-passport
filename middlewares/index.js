exports.ensureLogin = route => (req, res, next) => {
    if (req.user) next();
    else res.redirect(route);
}