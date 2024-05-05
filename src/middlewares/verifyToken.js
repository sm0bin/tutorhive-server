const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require('dotenv').config();


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Access Denied" });
    }
    console.log('token:', token, 'verifyToken');
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Access Denied" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;