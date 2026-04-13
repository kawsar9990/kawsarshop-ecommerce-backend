const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
 userId: { 
   type: mongoose.Schema.Types.ObjectId, 
   ref: 'User', 
   required: true,
   unique: true
},
products: [
{
_id: String,
name: String,
price: Number,
image: String,
discountPercent: String,
catetitle: String,
ratestar: String,
oldprice: Number 
}
]
},{timestamps: true})

module.exports = mongoose.model('Wishlist', wishlistSchema);