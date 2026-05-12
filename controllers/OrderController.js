const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";

exports.createOrder = async (req, res) => {
try{
const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalAmount, shippingMethodName } = req.body;

const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')){
  return res.status(401).json({ message: "Unauthorized! Please login first." });  
}

const token = authHeader.split(' ')[1];
let decoded;
try{
decoded = jwt.verify(token, JWT_SECRET);
}catch(error){
return res.status(401).json({ message: "Invalid or Expired Token!" });
}

const order = new Order({
userId: decoded.id,
orderItems,
shippingAddress,
paymentMethod,
shippingMethodName,
itemsPrice,
shippingPrice,
totalAmount,
orderStatus: "Pending"
});

const createdOrder = await order.save();
res.status(201).json({ success: true, orderId: createdOrder._id });
}catch(error){
 res.status(500).json({ message: error.message });   
}
};



exports.getOrderById = async (req, res) => {
try{
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: "No token provided" });
const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);

const order = await Order.findById(req.params.id);

if (!order) {
return res.status(404).json({ message: "Order Not Found!" });
}

if (order.userId.toString() !== decoded.id) {
return res.status(403).json({ message: "You are not authorized to view this order!" });
}
res.status(200).json(order);
}catch(error){
  res.status(500).json({ message: error.message });  
}
}



exports.updateOrderStatus = async (req, res) => {
try{
const order = await Order.findById(req.params.id);
if (!order) {
return res.status(404).json({ message: "Order Not Found!" });
}

const newStatus = req.body.status || req.body.orderStatus;

if (newStatus === 'Delivered' && order.orderStatus !== 'Delivered') {
  const updateStockPromises = order.orderItems.map(async (item) => {
   const productId = item.product;

   return await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: -item.quantity } },
    { new: true }
   );
  });
  await Promise.all(updateStockPromises);

order.isDelivered = true;
order.deliveredAt = Date.now();
order.isPaid = true;
order.paidAt = Date.now();
}

if (newStatus) {
      order.orderStatus = newStatus;
}

if (req.body.isPaid === true) {
  order.isPaid = true;
  order.paidAt = Date.now();
}


const updatedOrder = await order.save();
res.status(200).json({ 
      success: true, 
      message: `Order status updated to ${newStatus}`,
      data: updatedOrder 
});
}
catch(error){
 res.status(500).json({ message: error.message }); 
}
}


exports.getOrdersByUserId = async (req, res) => {
try{
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: "No token provided" });

const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);

if (decoded.id !== req.params.userId) {
    return res.status(403).json({ message: "Unauthorized!" });
}

const orders = await Order.find({ userId: req.params.userId })
                          .sort({ createdAt: -1 })
res.status(200).json({ success: true, orders });
}
catch(error){
 res.status(500).json({ message: error.message }); 
}
}