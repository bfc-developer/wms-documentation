const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'wms-documentation-secret-key';

const LOCAL_USER = {
  email: 'sample@sample.com',
  password: '123456'
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check local credentials
    if (email === LOCAL_USER.email && password === LOCAL_USER.password) {
      const token = generateToken(LOCAL_USER.email);
      return res.status(200).json({
        success: true,
        token,
        message: 'Login successful'
      });
    }

    // Fallback check in database if user exists
    try {
      const userFound = await User.findOne({ email: email });
      if (userFound && userFound.password === password) {
        const token = generateToken(userFound.email);
        return res.status(200).json({
          success: true,
          token,
          message: 'Login successful'
        });
      }
    } catch (dbError) {
      console.warn('Database user lookup skipped or unavailable:', dbError.message);
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

function generateToken(email) {
  const data = {
    email: email,
    time: new Date().toISOString()
  };
  return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
  login
};