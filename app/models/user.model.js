const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const userScheme = new Schema({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: false,
    unique: false,
    match: EMAIL_REGEXP
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userScheme);
