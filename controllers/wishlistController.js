const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');


exports.getWishlist = async (req, res) => {
const { userId } = req.query;
try{
if (!userId) return res.status(200).json([]);

const validUserId = new mongoose.Types.ObjectId(userId);
const wishlist = await Wishlist.findOne({ userId: validUserId });
res.status(200).json(wishlist ? wishlist.products : []);
}
catch(error){
res.status(500).json({ message: "Server error" });  
}
}


exports.toggleWishlist = async (req, res) => {
  const { userId, product } = req.body;

try{
if (!userId) {
return res.status(400).json({ message: "User ID is required" });
}
const validUserId = new mongoose.Types.ObjectId(userId);
let wishlist = await Wishlist.findOne({ userId: validUserId });

if(!wishlist){
 wishlist = new Wishlist({ userId: validUserId, products: [product] });   
}else{
const isExist = wishlist.products.find(item => item._id.toString() === product._id.toString());
if(isExist){
wishlist.products = wishlist.products.filter(item => item._id.toString() !== product._id.toString());
}else{
 wishlist.products.push(product);   
}
}
await wishlist.save();
res.status(200).json(wishlist.products);
}
catch(error){
 res.status(500).json({ message: "Error updating wishlist" }); 
}
}