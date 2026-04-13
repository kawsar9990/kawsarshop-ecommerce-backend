const Voucher = require('../models/Voucher');

exports.verifyVoucher = async (req, res) => {
try{
const { code, subtotal } = req.body;

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

if(subtotal < voucher.minAmount){
return res.status(400).json({ 
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