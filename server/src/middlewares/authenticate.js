const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../core/error.response');

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token)
        throw new UnauthorizedError();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) throw new ForbiddenError();

        req.user = user; // Gắn thông tin user vào req để dùng tiếp
        next();
    });
}