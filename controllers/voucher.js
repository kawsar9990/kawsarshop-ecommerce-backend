const Voucher = require('../models/Voucher');

exports.verifyVoucher = async (req, res) => {
try{
const { code, subtotal, userId } = req.body;

const voucher = await Voucher.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
});

if (!voucher) {
 return res.status(404).json({ 
   success: false, 
   message: "Invalid or Expired Voucher Code!" 
 });
}

if (voucher.expiryDate && new Date() > new Date(voucher.expiryDate)){
return res.status(400).json({ success: false, message: "This voucher has expired!" });  
}

if (voucher.usedBy.length >= voucher.usageLimit){
return res.status(400).json({ success: false, message: "Voucher usage limit reached!" });  
}

if (userId && voucher.usedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You have already used this voucher!" });
}


if(subtotal < voucher.minAmount){
return res.status(200).json({ 
  success: false, 
  message: `This voucher requires a minimum order of ${voucher.minAmount} TK` 
});    
}

res.status(200).json({
      success: true,
      message: "Voucher applied successfully!",
      voucher: {
        code: voucher.code,
        value: voucher.value,
        type: voucher.type
      }
 });
}catch(err){
  res.status(500).json({ 
      success: false, 
      message: "Internal Server Error!" 
  });  
}
}