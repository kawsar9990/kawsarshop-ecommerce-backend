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