const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: { type: String, unique: true },
  name: String,
  role: { type: String, enum: ['student', 'parent'] },
  points: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 