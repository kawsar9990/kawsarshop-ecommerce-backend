const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Product = require('./models/Product')
const User = require('./models/User')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";


const transporter = nodemailer.createTransport({
     host: 'smtp-relay.brevo.com',
     port: 587,
     secure: false,
     auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_SMTP_KEY
}})


mongoose.connect(mongoURI)
.then(() => {
console.log("MongoDB Connect")
})
.catch((err) => {
console.log(err)
console.log("Connection Problem")
})




app.get('/', (req,res) => {
    res.send("KawsarShop API is Ready")
});




app.post('/api/register', async(req, res) => {
try{
const { email, password, confirmpassword, firstname, lastname, phone, gender, dob, newsletter } = req.body;

if (password !== confirmpassword ) {
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
const otp = Math.floor(100000 + Math.random() * 900000).toString();
const otpExpires = Date.now() + 10 * 60 * 1000;

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt)

const newUser = new User({
    username: `${firstname} ${lastname}`,
    email,
    phone,
    gender,
    dob,
    newsletter,
    password: hashedPassword,
    resetOtp: otp, 
    resetOtpExpires: otpExpires
});
await newUser.save();

const mailOptions = {
 from: `"KawsarShop" <${process.env.SENDER_EMAIL}>`,
 to: email,
 subject: "Verify Your Account - KawsarShop",
 html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #f97316; text-align: center;">Welcome to KawsarShop!</h2>
            <p style="text-align: center; color: #555;">Use the code below to verify your account:</p>
            <div style="background: #fff5ed; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 10 minutes.</p>
        </div>`
          
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("Mail Error:", error);
    else console.log("Mail Sent:", info.response);
});
return res.status(201).json({ message: "OTP sent to your email." });
}
catch(err){
console.error("Register Error:", err);
res.status(500).json({ message: "Registration failed", error: err.message });
}
});


app.post('/api/verify-otp', async (req, res) => {
try{
const { email, otp } = req.body;
const user = await User.findOne({ email });
if (!user) {
    return res.status(404).json({ message: "User not found!" });
}
 if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP!" });
}
user.resetOtp = undefined;
user.resetOtpExpires = undefined;
await user.save();
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.status(200).json({message: "Email verified successfully!",token, user: { id: user._id, username: user.username, email: user.email }})
}
catch(err){
res.status(500).json({ message: "Verification failed", error: err.message });
}
})



app.get('/api/all-products', async (req,res) => {
    try{
    const {category, isHomePage, isHomeTab, isFeatured, isLatest, isAllProduct} = req.query;
    let filter = {};

    if(category){
    filter.$or = [
        { category: category },
        { subCategory: category },]}

    if(isHomePage === 'true'){
        filter.isHomePage = true
    }
    if(isHomeTab === 'true'){
        filter.isHomeTab = true
    }
    if(isFeatured !== undefined){
        filter.isFeatured = (isFeatured === 'true');
    }
    if(isLatest === 'true'){
        filter.isLatest = true;
    }
    if(isAllProduct === 'true'){
        filter.isAllProduct = true;
    }

    const products = await Product.find(filter).sort({createdAt: -1})
    res.json(products)
    }
    catch (err) {
    res.status(500).json({ message: "No Data Match", error: err.message})
    }
})





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at: (http://localhost:5000)`)
})