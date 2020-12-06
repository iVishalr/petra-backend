const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  tokenId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  perks: {
    type: String,
  },
});

module.exports = userSchema;
