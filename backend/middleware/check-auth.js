const { JsonWebTokenError } = require('jsonwebtoken');

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secretkey');
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Auth validation failed'
        });
    }
};