const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const response = require('../helpers/response.helper');

const verifyToken = (req, res, next) => {
    const token = req.headers['access-token'];

    if (!token) {
        response.responseHelper(res, false, 'No token provided!', 'Authentication failed');
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            response.responseHelper(res, false, 'Unauthorized!', 'Authentication failed');
        }
        next();
    });
};

module.exports = verifyToken;