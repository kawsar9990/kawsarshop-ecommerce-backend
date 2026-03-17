const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    gender: { type: String },
    dob: { type: Object },
    newsletter: { type: Boolean, default: false },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);