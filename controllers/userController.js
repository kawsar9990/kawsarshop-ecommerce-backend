const User = require('../models/User');
const bcrypt = require('bcryptjs');



exports.updateProfilePic = async (req, res) => {
try{

const { userId, imageUrl } = req.body;

if (!userId) {
return res.status(400).json({ message: "User ID is required!" });
}

const updatedUser = await User.findByIdAndUpdate(
  userId,
  { profilePic: imageUrl || "" },
  { new: true }
).select("-password");

if (!updatedUser) {
return res.status(404).json({ message: "User not found!" });
}

res.status(200).json({
    success: true,
    message: "Profile picture updated successfully!",
    user: updatedUser
});
}
catch(err){
 res.status(500).json({ message: "Server Error!" });   
}
}






exports.updateProfileName = async (req, res) => {
try{
  const { userId, username } = req.body;
  if (!userId || !username) {
    return res.status(400).json({ message: "User ID and Name are required!" });
    }
   const updatedUser = await User.findByIdAndUpdate(
    userId,
    {username: username },
    {new: true}
   ).select("-password")

   if (!updatedUser) {
    return res.status(404).json({ message: "User not found!" });
    }
   res.status(200).json({
    success: true,
    message: "Profile name updated successfully",
    user: updatedUser
    }); 

}catch(err){
   res.status(500).json({ message: "Server Error!" });
}
}




exports.updatePhone = async (req, res) => {
try{
  const { userId, phone } = req.body;

  const existingUser = await User.findOne({ phone: phone });
  if(existingUser){
    if(existingUser._id.toString() !== userId){
        return res.status(400).json({
            message: "This number is already used on another account!"
        })
    }
  }

   const updatedUser = await User.findByIdAndUpdate(
    userId,
    {phone: phone},
    {new: true}
   ).select("-password")

   if (!updatedUser) {
    return res.status(404).json({ message: "User not found!" });
    }
   res.status(200).json({
    success: true,
    message: "Phone number updated successfully",
    user: updatedUser
    }); 

}catch(err){
   res.status(500).json({ message: "Server Error!" });
}
}







exports.updateProfileDOB = async (req, res) => {
try{
  const { userId, dob } = req.body;

 if (!userId || !dob) {
      return res.status(400).json({ message: "User ID and Date of Birth are required!" });
    }

   const updatedUser = await User.findByIdAndUpdate(
    userId,
    {dob: dob},
    {new: true}
   ).select("-password")

   if (!updatedUser) {
    return res.status(404).json({ message: "User not found!" });
    }
   res.status(200).json({
    success: true,
    message: "Date of Birth updated successfully",
    user: updatedUser
    }); 

}catch(err){
   res.status(500).json({ message: "Server Error!" });
}
}



exports.updateProfileGender = async (req, res) => {
  try {
    const { userId, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "Gender updated!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server Error!" });
  }
};



exports.updatePassword = async (req, res) => {
  const { userId, currentPassword, newPassword, isSocialUser } = req.body;

  try{
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!isSocialUser) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is wrong" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}



exports.updateNewsletter = async (req, res) => {
try{
const { userId, newsletter } = req.body;
const updatedUser = await User.findByIdAndUpdate(
    userId,
    { newsletter: newsletter },
    { new: true }
).select("-password");
res.status(200).json({ success: true, message: "Newsletter updated!", user: updatedUser });
}catch(err){
  res.status(500).json({ message: "Server Error!" });
}
}
