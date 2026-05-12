const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";

exports.submitReview = async (req, res) => {
try {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: "No token provided" });

const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);
const { productId, orderId, rating, comment } = req.body;

const currentUser = await User.findById(decoded.id);
if (!currentUser) return res.status(404).json({ message: "User not found!" });
const order = await Order.findById(orderId);
if (!order) return res.status(404).json({ message: "Order not found" });
if (order.userId.toString() !== decoded.id) {
    return res.status(403).json({ message: "Unauthorized!" });
}
if (order.orderStatus !== 'Delivered') {
    return res.status(400).json({ message: "Only delivered orders can be reviewed!" });
}
const orderItem = order.orderItems.find(
    item => item.product.toString() === productId
);
if (!orderItem) return res.status(404).json({ message: "Product not found in order" });
if (orderItem.isReviewed) {
    return res.status(400).json({ message: "You already reviewed this product!" });
}
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: "Product not found" });

const newReview = {
    userId: currentUser._id,
    username: currentUser.username || "Anonymous", 
    userImage: currentUser.profilePic || currentUser.image || "",
    email: currentUser.email || "", 
    rating: Number(rating),
    comment: comment,
    orderId: orderId,
    createdAt: new Date()
};
product.reviewsMutual.push(newReview);
const totalRating = product.reviewsMutual.reduce((sum, r) => sum + r.rating, 0);
product.ratestar = (totalRating / product.reviewsMutual.length).toFixed(1);
product.reviewCount = product.reviewsMutual.length;
await product.save();

orderItem.isReviewed = true;
await order.save();
res.status(200).json({ success: true, message: "Review submitted successfully!" });
} catch (error) {
res.status(500).json({ message: error.message });
}
};




exports.updateReview = async (req, res) => {
try {
const { productId, reviewId, rating, comment } = req.body;

if (!productId || !reviewId) {''
    return res.status(400).json({ message: "Missing Product or Review ID!" });
}

const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: "Product not found!" });

const review = product.reviewsMutual.id(reviewId);
if (!review) return res.status(404).json({ message: "Review not found!" });

review.rating = Number(rating);
review.comment = comment;
review.updatedAt = new Date();

const totalRating = product.reviewsMutual.reduce((sum, r) => sum + r.rating, 0);
product.ratestar = (totalRating / product.reviewsMutual.length).toFixed(1);

await product.save();
res.status(200).json({ success: true, message: "Review updated successfully!" });

} catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
}
};






exports.deleteReview = async (req, res) => {
try{
const {productId, reviewId, orderId} = req.body;

const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);

const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: "Product not found!" });

const review = product.reviewsMutual.id(reviewId);
if (!review) return res.status(404).json({ message: "Review not found!" });

if (review.userId.toString() !== decoded.id) {
return res.status(403).json({ message: "Unauthorized!" });
}

product.reviewsMutual.pull(reviewId);

if(product.reviewsMutual.length > 0){
const totalRating = product.reviewsMutual.reduce((sum, r) => sum + r.rating, 0);
product.ratestar = (totalRating / product.reviewsMutual.length).toFixed(1)
}else {
product.ratestar = 0;
}
product.reviewCount = product.reviewsMutual.length;

if (orderId) {
const order = await Order.findById(orderId);
if(order){
    let itemUpdated = false;
    order.orderItems.forEach(item => {
       if (item.product.toString() === productId.toString()) {
            item.isReviewed = false;
            itemUpdated = true;
        } 
    });
    if(itemUpdated){
        order.markModified('orderItems');
        await order.save();
    }
}
}

await product.save();
res.status(200).json({ success: true, message: "Review deleted successfully!" });
}
catch(error){
res.status(500).json({ message: error.message });
}
}