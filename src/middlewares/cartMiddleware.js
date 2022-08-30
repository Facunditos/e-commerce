module.exports = (req, res, next) => {
    req.session.carts = req.session.carts || {};
    next();
};
