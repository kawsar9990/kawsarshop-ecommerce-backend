const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
},
orderItems: [
    {
       name: { type: String, required: true },
       quantity: { type: Number, required: true },
       slug: { type: String },
       sku: { type: String },
       category: {type: String, required: true},
       subCategory: { type: String },
       size: [String],
       selectedSize: { type: String, default: null },
       stock: { type: Number, default: 50 },
       image: { type: String, required: true },
       price: { type: Number, required: true },
       oldprice: { type: Number, default: 0 },
       title: String,
       discountPercent: String,
       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }
],

shippingAddress: {
    name: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
},

paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
paymentResult: { id: String, status: String },
itemsPrice: { type: Number, required: true, default: 0.0 },
taxPrice: { type: Number, required: true, default: 0.0 },
shippingPrice: { type: Number, required: true, default: 0.0 },
totalAmount: { type: Number, required: true, default: 0.0 },
isPaid: { type: Boolean, required: true, default: false },
paidAt: { type: Date },
isDelivered: { type: Boolean, required: true, default: false },
deliveredAt: { type: Date },
orderStatus: { type: String, required: true, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);