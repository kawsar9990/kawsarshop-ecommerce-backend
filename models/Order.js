const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerEmail: String,
  customerPhone: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['COD', 'Bkash', 'Nagad', 'Card'] 
  },
  transactionId: { type: String, default: "" },
  paymentStatus: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'] 
  },
  orderStatus: { 
    type: String, 
    default: 'Processing',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
  shippingCost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);