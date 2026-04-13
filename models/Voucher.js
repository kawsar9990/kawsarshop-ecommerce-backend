const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
code: { type: String, required: true, unique: true, uppercase: true },
value: { type: Number, required: true },
type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
minAmount: { type: Number, default: 0 },
isActive: { type: Boolean, default: true },
expiryDate: { type: Date }
});

module.exports = mongoose.model('Voucher', voucherSchema);