const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    phone: { type: String, default: "" },
    gender: { type: String, default: "not specified" },
    dob: { type: String, default: "" },
    newsletter: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    image: {type: String, default: ""},
    profilePic: {
        type: String,
        default: ""
    },
    provider: {type: String, enum: ['local', 'google'], default: 'local'}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
