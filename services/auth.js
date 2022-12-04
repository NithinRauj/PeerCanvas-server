const jwt = require('jsonwebtoken');

const generateToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
}

const validateToken = (req, res, next) => {
    const headers = req.headers['authorization'];
    const token = headers && headers.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                req.user = data;
                next();
            }
        });
    }
}

module.exports = { generateToken, validateToken }