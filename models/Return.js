const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  returnedItems: [{
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    selectedSize: { type: String, default: null },
    image: { type: String, required: true },
    sku: { type: String },
    category: {type: String, required: true},
    subCategory: { type: String },
    stock: { type: Number, default: 50 },
    oldprice: { type: Number, default: 0 },
    title: {type: String},
    discountPercent: { type: Number, default: 0 }
  }],
  reason: {
    type: String,
    required: true
  },
  message: {
   type: String,
   maxLength: [50, "Message cannot be more than 50 characters!"],
   default: ""
  },
  images: [String],
  returnMethod: {
    type: String,
    enum: ['DropOff', 'PickUp'],
    required: true,
    default: 'PickUp'
  },
  returnShippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Drop-off/Pick-up', 'Package Received', 'QC Processing', 'Refunded', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  refundAmount: { 
    type: Number, 
    required: true, 
    default: 0.0 
  },
  totalRefundIssued: {
    type: Number,
    required: true,
    default: 0.0
  },
  refundDetails: {
    method: {
      type: String,
      enum: ['Wallet', 'Manual'],
      default: 'Wallet'
    },
    channel: {
      type: String,
      default: 'Wallet'
    },
    details: {
      email: { type: String, default: '' },
      cardName: { type: String, default: '' },
      cardNumber: { type: String, default: '' },
      cardIssuer: { type: String, default: '' },
      providerName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);