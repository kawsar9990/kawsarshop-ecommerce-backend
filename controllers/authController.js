require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Address = require('../models/Address');
const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";




exports.register = async (req, res) => {
try{
const { email, password, confirmPassword, firstname, lastname, phone, gender, dob, newsletter, captchaToken } = req.body;

if (!captchaToken) {
    return res.status(400).json({ message: "Please complete the 'I am human' verification!" });
}
const CLOUDFLARE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACwaQAamW0-HYG-Sfz5oUejXmDc";
const verifyResponse = await fetch(
"https://challenges.cloudflare.com/turnstile/v0/siteverify",
{
method: "POST",
headers: { "Content-Type": "application/x-www-form-urlencoded" },
body: `secret=${CLOUDFLARE_SECRET_KEY}&response=${captchaToken}`,
}
);

const outcome = await verifyResponse.json();
if (!outcome.success) {
return res.status(400).json({ message: "Captcha verification failed. Are you a robot?" });
}

if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
}


const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
if (existingUser) {
    if (existingUser.email === email) {
     return res.status(400).json({ message: "This Email is already registered. Try login!" });
}
    if (existingUser.phone === phone) {
     return res.status(400).json({ message: "Phone number already exists!" });
}}



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
    password: hashedPassword,
    provider: 'local',
    walletBalance: 0,
    isPremium: false,     
    premiumPlan: 'none',
    premiumExpiresAt: null
});
const savedUser = await newUser.save();
const token = jwt.sign(
    { 
        id: savedUser._id, 
        username: savedUser.username, 
        email: savedUser.email, 
        profilePic: savedUser.profilePic || "",
        walletBalance: savedUser.walletBalance || 0,
        isPremium: savedUser.isPremium,
        premiumPlan: savedUser.premiumPlan
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
);
res.status(201).json({ 
    message: "Registration successful!", 
    token, 
    user: { 
        id: savedUser._id, 
        username: savedUser.username, 
        email: savedUser.email,
        phone: savedUser.phone || "",
        dob: savedUser.dob || {},
        gender: savedUser.gender || "",
        profilePic: "",
        newsletter: savedUser.newsletter,
        walletBalance: savedUser.walletBalance || 0,
        isPremium: savedUser.isPremium,
        premiumPlan: savedUser.premiumPlan,
        premiumExpiresAt: savedUser.premiumExpiresAt
    } 
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

if (user.provider === 'google' && !user.password) {
    return res.status(400).json({ message: "This account is linked with Google. Please login with Google." });
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(400).json({ message: "Invalid Password!" });
}

if (user.isPremium && user.premiumExpiresAt && new Date() > new Date(user.premiumExpiresAt)) {
  user.isPremium = false;
  user.premiumPlan = 'none';
  user.premiumExpiresAt = null;
  await user.save();
}


const token = jwt.sign(
    { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        profilePic: user.profilePic || user.image || "",
        walletBalance: user.walletBalance || 0,
        isPremium: user.isPremium,
        premiumPlan: user.premiumPlan 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
);
res.status(200).json({
    message: "Login successful!",
    token,
    user: { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      phone: user.phone || "",
      dob: user.dob || {},
      gender: user.gender || "",
      newsletter: user.newsletter,
      profilePic: user.profilePic || user.image || "",
      walletBalance: user.walletBalance || 0,
      isPremium: user.isPremium,
      premiumPlan: user.premiumPlan,
      premiumExpiresAt: user.premiumExpiresAt
    }
});
}
catch(err){
res.status(500).json({ message: "Login failed", error: err.message });
}
}



exports.socialLogin = async (req, res) => {
  try {
    const { name, email, image, provider } = req.body;

    if (!email) return res.status(400).json({ message: "Email not found" });
    let user = await User.findOne({ email });

if (user) {

if (user.isPremium && user.premiumExpiresAt && new Date() > new Date(user.premiumExpiresAt)) {
  user.isPremium = false;
  user.premiumPlan = 'none';
  user.premiumExpiresAt = null;
  await user.save();
}

const token = jwt.sign(
{ id: user._id, 
  username: user.username, 
  email: user.email, profilePic: 
  user.profilePic || user.image || "",
  walletBalance: user.walletBalance,
  isPremium: user.isPremium,
  premiumPlan: user.premiumPlan
},
JWT_SECRET,
{ expiresIn: '7d' }
);
  return res.status(200).json({
    message: "Login successful!",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || "",      
      gender: user.gender || "not specified", 
      dob: user.dob || "",           
      newsletter: user.newsletter,  
      profilePic: user.profilePic || user.image || image || "",
      walletBalance: user.walletBalance,
      isPremium: user.isPremium,
      premiumPlan: user.premiumPlan,
      premiumExpiresAt: user.premiumExpiresAt
    }
  });
}

  const timestamp = Date.now().toString().slice(-4); 
  const safeUsername = (name || "user").toLowerCase().replace(/\s/g, '') + timestamp;
    
const newUser = new User({
  username: safeUsername,
  email: email,
  image: image || "",
  profilePic: image || "",
  provider: provider || 'google',
  password: "", 
  phone: "",
  isVerified: true,
  gender: "not specified",
  newsletter: false,
  dob: "",
  walletBalance: 0,
  isPremium: false,
  premiumPlan: 'none',
  premiumExpiresAt: null
});

  const savedUser = await newUser.save();
   const token = jwt.sign(
    { 
        id: savedUser._id, 
        username: savedUser.username, 
        email: savedUser.email, 
        profilePic: savedUser.profilePic || savedUser.image || "",
        walletBalance: savedUser.walletBalance || 0,
        isPremium: savedUser.isPremium,
        premiumPlan: savedUser.premiumPlan 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
   res.status(201).json({
     message: "Registration successful!",
     token,
    user: {
    id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    phone: savedUser.phone || "",      
    gender: savedUser.gender || "not specified",
    dob: savedUser.dob || "",        
    newsletter: savedUser.newsletter,   
    profilePic: savedUser.profilePic || savedUser.image || "",
    walletBalance: savedUser.walletBalance || 0,
    isPremium: savedUser.isPremium,
    premiumPlan: savedUser.premiumPlan,
    premiumExpiresAt: savedUser.premiumExpiresAt
     }
   });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This account info is already in use. Please try another Gmail." });
    }
    res.status(500).json({ message: "Database Error", error: err.message });
  }
};


exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#f0f0f0'  
  });
  res.cookie('captcha', captcha.text.toLowerCase(), {
    httpOnly: true,
    secure: true,     
    sameSite: 'none',  
    partitioned: true, 
    maxAge: 300000 
  });
  res.type('svg');
  res.status(200).send(captcha.data);
}


exports.resetPasswordWithDOB = async (req, res) => {
try{
const { identifier, dob, newPassword, confirmPassword, captchaInput, step } = req.body;
const sessionCaptcha = req.cookies.captcha;
if(step === 1){
if(!sessionCaptcha){
 return res.status(400).json({ message: "Captcha expired! Please refresh." }); 
}
if (!captchaInput || captchaInput.toLowerCase() !== sessionCaptcha){
   return res.status(400).json({ message: "Invalid Captcha! Try again." }); 
}   
const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
if (!user) return res.status(404).json({ message: "User not found!" });
res.clearCookie('captcha');
return res.status(200).json({ message: "Captcha & User Verified!" });
}
if(step === 2){
const user = await User.findOne({ 
    $or: [{ email: identifier }, { phone: identifier }],
    dob: dob 
});    
if (!user) return res.status(403).json({ message: "Incorrect Date of Birth!" });
return res.status(200).json({ message: "Identity Verified!" });
}
if(step === 3){
if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match!" });
const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }], dob });
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);
user.provider = 'local';
await user.save();
return res.status(200).json({ message: "Password updated successfully!" });
}
}
catch(err){
  res.status(500).json({ message: "Server error", error: err.message });  
}
}



exports.deleteAccount = async (req, res) => {
  try{
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }
  

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }


    await Promise.all([
      Cart.deleteMany({ userId: userId }),
      Wishlist.deleteMany({ userId: userId }),
      Address.deleteMany({ userId: userId })
    ]);

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully."
    });
  }catch(err){
    res.status(500).json({ message: "Server Error! Could not delete account." });
  }
};






exports.activateMembership = async (req, res) =>{
try{
const { userId, plan } = req.body;

if (!userId || !plan) {
return res.status(400).json({ message: "User ID and Plan type are required!" });
}

if (!['trial', 'one-year'].includes(plan)) {
return res.status(400).json({ message: "Invalid plan type!" });
}

let expiryDate = new Date();
if(plan === 'trial'){
  expiryDate.setDate(expiryDate.getDate() + 7);
} else if(plan === 'one-year'){
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
}

const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    isPremium: true,
    premiumPlan: plan,
    premiumExpiresAt: expiryDate 
  },
  { new: true }
).select("-password");

if (!updatedUser) {
  return res.status(404).json({ message: "User not found!" });
};

const token = jwt.sign(
  { 
      id: updatedUser._id, 
      username: updatedUser.username, 
      email: updatedUser.email, 
      profilePic: updatedUser.profilePic || updatedUser.image || "",
      walletBalance: updatedUser.walletBalance || 0,
      isPremium: updatedUser.isPremium,         
      premiumPlan: updatedUser.premiumPlan
  }, 
  JWT_SECRET, 
  { expiresIn: '7d' }
);

res.status(200).json({
  success: true,
  message: `Membership activated successfully for ${plan === 'trial' ? '7 Days Trial' : 'One-Year Plan'}!`,
  token,
  user: updatedUser
});
}
catch(error){
res.status(500).json({ message: "Server Error! Could not activate membership.", error: err.message });  
}
};





exports.cancelMembership = async (req, res) =>{
try{
const { userId } = req.body;

if (!userId) {
return res.status(400).json({ message: "User ID is required!" });
}

const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    isPremium: false,
    premiumPlan: 'none',
    premiumExpiresAt: null
  },
  {new: true}
).select("-password");

if (!updatedUser) {
return res.status(404).json({ message: "User not found!" });
}

const token = jwt.sign(
{
id: updatedUser._id,
username: updatedUser.username,
email: updatedUser.email,
profilePic: updatedUser.profilePic || updatedUser.image || "",
walletBalance: updatedUser.walletBalance || 0,
isPremium: false,
premiumPlan: 'none'  
},
JWT_SECRET,
{expiresIn: '7d'}
);

res.status(200).json({
  success: true,
  message: "Membership cancelled successfully!",
  token,
  user: updatedUser
});

}
catch(error){
  res.status(500).json({ message: "Server Error!", error: error.message });
}
}