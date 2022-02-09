const User = require("../models/User");

module.exports = function isAuthenticated(req, res, next) {
    const token = req.header('authorization');
    if(token) {
        User.findOne({auth_token: token})
            .then(user => {
                req.currentUser = user;
                next();
            })
    } else {
        res.status(401).json("Unauthorized");
    }
}