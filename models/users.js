const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  authKey: {
    type: String,
    default: null
  },
  tfaEnabled: {
    type: Boolean,
    required: false,
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;