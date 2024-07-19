const jwt = require('jsonwebtoken');

const verifyAndRefreshToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'No token provided',
        });
    }

    jwt.verify(token, 'SECRET', (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Failed to authenticate token',
            });
        }

        // Check if the token is about to expire (e.g., within the next 10 minutes)
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - now;

        if (timeLeft < 600) { // less than 10 minutes
            const newTokenPayload = {
                nip: decoded.nip,
            };

            const newAccessToken = jwt.sign(newTokenPayload, 'SECRET', { expiresIn: "1h" });

            res.cookie('token', newAccessToken, { httpOnly: true });
        }

        req.decoded = decoded;
        next();
    });
};

module.exports = verifyAndRefreshToken;
