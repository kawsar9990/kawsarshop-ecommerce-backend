const Return = require('../models/Return');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "kawsar_secret_key_123";



exports.getOrderDataForReturn = async (req, res) => {
try{
const { orderId } = req.params;

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

const order = await Order.findById(orderId);
if (!order){
return res.status(404).json({ message: "Order Not Found!" });
}

if (order.userId.toString() !== decoded.id){
return res.status(403).json({ message: "You are not authorized to view this order data!" });
}

if(!order.isDelivered || order.orderStatus !== "Delivered"){
return res.status(400).json({ success: false, message: "You can only return items from a delivered order!" });
}

const deliveryDate = new Date(order.deliveredAt);
const today = new Date();
const differenceInDays = (today - deliveryDate) / (1000 * 60 * 60 * 24);

if(differenceInDays > 7){
return res.status(400).json({ success: false, message: "Return period has expired! You can only return items within 7 days of delivery." });
};


res.status(200).json({ success: true, message: "Data retrieved successfully for Return Page.", orderItems: order.orderItems });
}
catch(error){
res.status(500).json({ message: error.message });
}
};





exports.applyReturn = async (req, res) =>{
try{
const { orderId, selectedItemIds, reason, message, images, returnMethod, returnShippingCost, refundDetails } = req.body;


if (!selectedItemIds || selectedItemIds.length === 0) {
  return res.status(400).json({ message: "Please select at least one item to return!" });
}


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

const order = await Order.findById(orderId);
if (!order){
return res.status(404).json({ message: "Order Not Found!" })
};


if (images && Array.isArray(images) && images.length > 5) {
return res.status(400).json({ message: "You can upload a maximum of 5 images for a return request!" });
}


if (order.userId.toString() !== decoded.id){
return res.status(403).json({ message: "You are not authorized to return items from this order!" });
};

if (order.orderStatus !== "Delivered"){
return res.status(400).json({ message: "You can only return items from a delivered order!" });
};

const deliveryDate = new Date(order.deliveredAt);
const today = new Date();
const differenceInDays = (today - deliveryDate) / (1000 * 60 * 60 * 24);
if(differenceInDays > 7){
return res.status(400).json({ message: "Return window closed! 7 days validity expired." }); 
}

let returnedItems = [];
let calculatedRefundAmount = 0;
let alreadyRequested = false;

order.orderItems.forEach(item => {
 if (selectedItemIds.includes(item._id.toString())){

  if(item.returnStatus === "Return Requested" || item.returnStatus === "Refunded"){
    alreadyRequested = true;
  }

  returnedItems.push({
    orderItemId: item._id,
    product: item.product,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
    sku: item.sku,
    category: item.category,
    subCategory: item.subCategory,
    selectedSize: item.selectedSize,
    stock: item.stock,
    oldprice: item.oldprice,
    title: item.title,
    discountPercent: Number(item.discountPercent) || 0
  });
  calculatedRefundAmount += item.price * item.quantity;
  item.returnStatus = "Return Requested";
 }
});

if(alreadyRequested){
return res.status(400).json({ message: "One or more selected items have already been applied for return!" });  
}

if(returnedItems.length === 0){
return res.status(400).json({ message: "No valid items found to return from this order!" });
}


const shippingCost = Number(returnShippingCost) || 0;
let finalIssuedRefund = calculatedRefundAmount - shippingCost;;
if (finalIssuedRefund < 0) finalIssuedRefund = 0;

const newReturn = new Return({
 orderId: order._id,
 userId: decoded.id, 
 returnedItems,
 reason,
 message,
 images: images || [],
 returnMethod: returnMethod || 'PickUp',
 returnShippingCost: shippingCost,
 refundAmount: calculatedRefundAmount,
 totalRefundIssued: finalIssuedRefund,
 status: 'Pending',
 refundDetails: {                                          // ← এটা add করুন
   method: refundDetails?.method || 'Wallet',
   channel: refundDetails?.channel || 'Wallet',
   details: refundDetails?.details || {}
 }
});

const savedReturn = await newReturn.save();
await order.save();

res.status(201).json({
  success: true,
  message: "Your return request has been submitted successfully!",
  data: savedReturn
});
}
catch(error){
res.status(500).json({ message: error.message });
}
};





exports.cancelReturnByUser = async (req, res) =>{
try{
const { returnId } = req.body;

const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer ')){
return res.status(401).json({ message: "Unauthorized!" });
}

const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);

const returnDoc = await Return.findById(returnId);
if(!returnDoc){
return res.status(404).json({ message: "Return Request Not Found!" });
}

if(returnDoc.status !== 'Pending'){
 return res.status(400).json({ message: `Cannot cancel! Request is already processed to: ${returnDoc.status}` }); 
}

const order = await Order.findById(returnDoc.orderId);
if(!order){
return res.status(404).json({ message: "Associated Order Not Found!" });
}

const returnedProductIds = returnDoc.returnedItems.map(item => item.product.toString());

order.orderItems.forEach(item => {
if (returnedProductIds.includes(item.product.toString()) && item.returnStatus === "Return Requested") {
  item.returnStatus = "Not Applied";
}
});

returnDoc.status = 'Cancelled';

await returnDoc.save();
await order.save();

res.status(200).json({
success: true,
message: "Your return request has been cancelled successfully!",
orderData: order
});
}
catch(error){
res.status(500).json({ message: error.message });
}
};




exports.updateReturnStatusByAdmin = async (req, res) =>{
try{
const { returnId, status } = req.body;

const validStatuses = ['Pending', 'Drop-off/Pick-up', 'Package Received', 'QC Processing', 'Refunded', 'Rejected', 'Cancelled'];
if(!validStatuses.includes(status)){
return res.status(400).json({ message: "Invalid status state provided!" });
}

const returnDoc = await Return.findById(returnId);
if (!returnDoc) {
  return res.status(404).json({ message: "Return record not found!" });
};

const order = await Order.findById(returnDoc.orderId);
if (!order) {
  return res.status(404).json({ message: "Associated Order not found!" });
};


if(status === 'Refunded' && returnDoc.refundDetails?.method === 'Wallet'){
 await User.findByIdAndUpdate(
  returnDoc.userId,
  { $inc: { walletBalance: returnDoc.totalRefundIssued } }
 ); 
}

returnDoc.status = status;

const returnOrderItemIds = returnDoc.returnedItems.map(item => item.orderItemId ? item.orderItemId.toString() : null);


order.orderItems.forEach(item => {
if(returnOrderItemIds.includes(item._id.toString()) || returnDoc.returnedItems.some(ri => ri.product.toString() === item.product.toString())){

if(status === 'Refunded'){
 item.returnStatus = 'Refunded'; 
} else if(status === 'Cancelled' || status === 'Rejected'){
  item.returnStatus = 'Not Applied';
} else{
  item.returnStatus = 'Return Requested';
}
} 
});


await returnDoc.save();
await order.save();

res.status(200).json({
  success: true,
  message: `Return workflow status updated to: ${status}`,
  data: returnDoc
});
}
catch(error){
res.status(500).json({ message: error.message });  
}
};




exports.getReturnHistoryByUser = async (req, res) => {
try{
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: "Unauthorized! Please login first." });
}

const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);

const returns = await Return.find({ userId: decoded.id }).sort({ createdAt: -1 });

res.status(200).json({
  success: true,
  count: returns.length,
  returns
});
}
catch(error){
res.status(500).json({ message: error.message });  
}
}