const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: [true, 'Country name is required'],
  },
  addressType: {
    type: String,
    enum: ['Home', 'Office'],
    default: 'Home'
  },
  idNumber: {
    type: String,
    required: [true, 'ID or Passport number is required'],
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })



module.exports = mongoose.model('Address', addressSchema);