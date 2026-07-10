const authenticator = require('authenticator');
const jwt = require('jsonwebtoken');
const User = require("../models/users")

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    if (!userFound?.tfaEnabled) {
      const authData = createAuthToken(email, userFound?.authKey);
      await storeKey(email, authData.formattedKey);
      res.status(200).json({ success: true, TFA_url: authData.uri, message: 'Login successful' });
      return;
    }
    else {
      res.status(200).json({ success: true, message: 'Login successful' });
      return;
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}

const verifyTFA = async (req, res) => {
  try {
    const email = req.body.email;
    const code = req.body.code;

    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      res.status(401).json({ success: false, message: 'Invalid user' });
      return;
    };
    const result = authenticate(userFound.authKey, code);
    if (result) {
      if (!userFound?.tfaEnabled) {
        enableTFA(email);
      }
      const token = generateApiKey(userFound)
      res.status(200).json({ success: true, token, message: 'Login successful' });
      return;
    }
    else {
      res.status(401).json({ success: false, message: 'Invalid code' });
      return;
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}


// helper functions
function createAuthToken(email, key) {
  let formattedKey
  if (!key) {
    formattedKey = authenticator.generateKey();
  }
  else {
    formattedKey = key;
  }
  const uri = authenticator.generateTotpUri(formattedKey, email, "Prodigy Pro Docs", 'SHA1', 6, 30);
  return { formattedKey, uri };
}

async function storeKey(email, key) {
  const user = await User.findOne({ email: email });
  user.authKey = key;
  await user.save();
}

function authenticate(formattedKey, userToken) {
  const result = authenticator.verifyToken(formattedKey, userToken);
  return result
}

async function enableTFA(email) {

  const user = await User.findOne({ email: email });
  user.tfaEnabled = true;
  await user.save();
}

function generateApiKey(user) {
  let data = {
    time: Date(),
    email: user?.email,
  }
  const token = jwt.sign(data, user?.authKey);
  return token;
}

module.exports = {
  login,
  verifyTFA
}