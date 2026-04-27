const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  unique: true 
},
appliedVoucher: { type: String, default: null },
voucherValue: { type: Number, default: 0 }, 
voucherType: { type: String, default: null },
items: [
{
 _id: String,
  name: String,
  category: {type: String, required: true},
  subCategory: { type: String },
  sku : {type: String, unique: true},
  categoryImg: [String],
  catetitle: {type: String, required: true},
  title: String,
  description: String,
  discountPercent: String,
  ratestar: { type: Number, default: 0 },
  review: String,
  size: [String],
  stock: Number,
  price: Number,
  oldprice: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  selected: { type: Boolean, default: true }  
}
]
}, { timestamps: true })



module.exports = mongoose.model('Cart', cartSchema);