const User = require("../models/users");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'wms-documentation-secret-key';

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
        // 1. Verify standard token signed with JWT_SECRET
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (jwtErr) {
            // Not signed with JWT_SECRET, try legacy fallback
        }

        // 2. Legacy fallback for tokens signed with userFound.authKey
        const payload = decryptToken(token);
        if (payload?.email) {
            try {
                const userFound = await User.findOne({ email: payload.email });
                if (userFound && userFound.authKey) {
                    const decoded = jwt.verify(token, userFound.authKey);
                    return decoded;
                }
            } catch (dbErr) {
                // Database unavailable or query failed
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

function decryptToken(token) {
    try {
        const parts = token.split('.');
        const encodedPayload = parts[1];
        if (!encodedPayload) return null;
        const decodedPayload = JSON.parse(Buffer.from(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'));
        return decodedPayload;
    } catch (e) {
        return null;
    }
}

module.exports = verifyJwtTokenMiddleware;