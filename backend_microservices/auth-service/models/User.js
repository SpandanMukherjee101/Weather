const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cities: { type: [String], default: ["Kolkata", "Tokyo", "Seoul"] }
});

module.exports = mongoose.model('User', userSchema);