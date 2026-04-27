const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
code: { type: String, required: true, unique: true, uppercase: true },
value: { type: Number, required: true },
type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
minAmount: { type: Number, default: 0 },
usageLimit: { type: Number, default: 100 },
isActive: { type: Boolean, default: true },
expiryDate: { type: Date },
usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Voucher', voucherSchema);