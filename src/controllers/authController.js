const jwt = require('jsonwebtoken');

exports.generateToken = async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).send({ success: true });
};

exports.logoutUser = async (req, res) => {
    const user = req.body;
    res.clearCookie('token', { maxAge: 0 }).send({ success: true });
};