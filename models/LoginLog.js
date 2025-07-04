const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
  loginTime: { type: Date, default: Date.now },
  ip: String // Optional: store user's IP address
});

module.exports = mongoose.model('LoginLog', loginLogSchema, 'login_logs'); 