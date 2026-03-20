const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";


exports.register = async (req, res) => {
try{
const { email, password, confirmPassword, firstname, lastname, phone, gender, dob, newsletter } = req.body;

if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
}

const existingUser = await User.findOne({ 
    $or: [
        { email: email }, 
        { phone: phone }
    ] 
});
if (existingUser) {
    if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered!" });
    }
    if (existingUser.phone === phone) {
        return res.status(400).json({ message: "Phone number already registered!" });
    }
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt)

const username = `${firstname}${lastname}`.toLowerCase().replace(/\s/g, '');
const newUser = new User({
    username,
    email,
    phone,
    gender,
    dob,
    newsletter,
    password: hashedPassword
});
const savedUser = await newUser.save();
const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' })
res.status(201).json({ 
    message: "Registration successful!", 
    token, 
    user: { id: savedUser._id, username: savedUser.username, email: savedUser.email } 
});
}
catch(err){
res.status(500).json({ message: "Registration failed", error: err.message });
}};



exports.login = async (req, res) => {
try{
const { email, password } = req.body;
const user = await User.findOne({ email: email });
if (!user) {
return res.status(404).json({ message: "User doesn't exists" });
}
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(400).json({ message: "Invalid Password!" });
}
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.status(200).json({
    message: "Login successful!",
    token,
    user: { id: user._id, username: user.username, email: user.email}
});
}
catch(err){
res.status(500).json({ message: "Login failed", error: err.message });
}
}
