const mongoose = require('mongoose');

const productData = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true},
    sku : {type: String, unique: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
    subCategory: { type: String },
    categoryImg: [String],
    catetitle: {type: String, required: true},
    title: String,
    description: String,
    oldprice: { type: Number, default: 0 },
    price: { type: Number, required: true },
    discountPercent: String,
    ratestar: { type: Number, default: 0 },
    review: String,
    reviewsMutual: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: {type: String},
            userImage: { type: String },
            rating: { type: Number, required: true },
            comment: {type: String, required: true },
            images: [String],
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    reviewCount: { type: Number, default: 0 },
    size: [String],
    stock: { type: Number, default: 50 },
    isLatest: {type: Boolean, default: false},
    isFeatured: {type: Boolean, default: false},
    isAllProduct: { type: Boolean, default: false },
    isHomeTab: { type: Boolean, default: false },
    isHomePage: { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Product', productData)