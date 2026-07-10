const User = require("../models/users")
const jwt = require('jsonwebtoken');

async function verifyJwtTokenMiddleware(req, res, next) {
    try {
        const token = req?.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }
        const decoded = await verifyJwtToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

async function verifyJwtToken(token) {
    try {
        const payload = decryptToken(token);
        const userFound = await User.findOne({ email: payload?.email });
        if (!userFound) {
            return null;
        };

        const decoded = jwt.verify(token, userFound.authKey);
        return decoded;
    } catch (error) {
        // console.log(error);
        return null;
    }
}

function decryptToken(token) {
    // Split the token into its three parts
    const parts = token.split('.');
    const encodedHeader = parts[0];
    const encodedPayload = parts[1];

    // Decode the header
    const decodedHeader = JSON.parse(atob(encodedHeader.replace(/-/g, '+').replace(/_/g, '/')));

    // Decode the payload
    const decodedPayload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    return decodedPayload;
}

module.exports = verifyJwtTokenMiddleware;