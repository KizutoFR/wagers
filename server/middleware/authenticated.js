const User = require("../models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function isAuthenticated(req, res, next) {
    const token = req.header('authorization');
    if(token) {
        jwt.verify(token, process.env.AUTH_SECRET_TOKEN, (err, decoded) => {
            console.log(decoded);
            req.currentUser = decoded.user;
            next();
        })
    } else {
        res.status(401).json("Unauthorized");
    }
}