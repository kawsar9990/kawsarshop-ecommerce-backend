const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  unique: true 
},
items: [
{
 _id: String,
  name: String,
  price: Number,
  oldprice: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  stock: Number,
  selected: { type: Boolean, default: true }  
}
]
}, { timestamps: true })



module.exports = mongoose.model('Cart', cartSchema);