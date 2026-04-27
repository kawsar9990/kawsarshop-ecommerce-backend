const Address = require('../models/Address');
const verifyCaptcha = require('../utils/captcha');

exports.addAddress = async (req, res) => {
try{
const { captchaToken, userId, fullName, phone, state, zip, city, houseNo, street, country, addressType, idNumber, isDefault } = req.body;
  

const captchaResult = await verifyCaptcha(captchaToken);
if (!captchaResult.success){
 return res.status(400).json({ 
    success: false, 
    message: captchaResult.message 
});   
}

if (isDefault) {
await Address.updateMany({ userId }, { isDefault: false });
}

const newAddress = new Address({
    userId,
    fullName,
    phone,
    state,
    zip,
    city,
    houseNo,
    street,
    country,
    addressType,
    idNumber,
    isDefault
});

const savedAddress = await newAddress.save();
res.status(201).json({ success: true, message: "Address added successfully!", data: savedAddress });
}
catch(err){
  res.status(500).json({ success: false, message: "Failed to add address", error: err.message });  
}  
};




exports.getAddresses = async (req, res) => {
try{
const { userId } = req.params;
const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
res.status(200).json({ success: true, data: addresses });
}
catch(err){
 res.status(500).json({ success: false, message: "Error fetching addresses", error: err.message });   
}
}




exports.updateAddress = async (req, res) =>{
try{
const { id } = req.params;
const updateData = req.body;

if (updateData.isDefault){
const currentAddress = await Address.findById(id);
await Address.updateMany({ userId: currentAddress.userId }, { isDefault: false });  
}

const updatedAddress = await Address.findByIdAndUpdate(id, updateData, { new: true });

if (!updatedAddress) {
return res.status(404).json({ success: false, message: "Address not found" });
}

res.status(200).json({ success: true, message: "Address updated successfully!", data: updatedAddress });
}
catch(err){
res.status(500).json({ success: false, message: "Update failed", error: err.message });    
}
}




exports.deleteAddress = async (req, res) => {
try{
const { id } = req.params;
const deletedAddress = await Address.findByIdAndDelete(id);

if (!deletedAddress) {
return res.status(404).json({ success: false, message: "Address not found" });
}

res.status(200).json({ success: true, message: "Address deleted successfully" });
}
catch(err){
res.status(500).json({ success: false, message: "Deletion failed", error: err.message });
}
}



exports.setDefaultAddress = async (req, res) => {
try{
const { id, userId } = req.body;
await Address.updateMany({ userId }, { isDefault: false });
const updated = await Address.findByIdAndUpdate(id, { isDefault: true }, { new: true });
res.status(200).json({ success: true, message: "Default address updated!", data: updated });
}
catch(err){
res.status(500).json({ success: false, message: "Error", error: err.message });  
}
}


