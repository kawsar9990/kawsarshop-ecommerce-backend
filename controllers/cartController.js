const Cart = require('../models/Cart');
const User = require('../models/User');


exports.syncCart = async (req, res) => {
  try {
    const { userId, cartItems, appliedVoucher, voucherValue } = req.body;
   
     const user = await User.findById(userId).select('walletBalance');
     const currentBalance = user ? user.walletBalance : 0;
   
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cartItems;
      cart.appliedVoucher = appliedVoucher;
      cart.voucherValue = voucherValue; 
      cart.walletBalance = currentBalance;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, 
      items: cartItems, 
      appliedVoucher, 
      voucherValue,
      walletBalance: currentBalance});
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = await Cart.findOne({ userId });

    let walletBalance = 0;
    if(userId){
      const user = await User.findById(userId).select('walletBalance');
      if(user){
        walletBalance = user.walletBalance;
      }
    }

   if (!cart) {
      return res.status(200).json({ 
        items: [], 
        appliedVoucher: null,
        voucherValue: 0,
        walletBalance: walletBalance
      });
    }

    res.status(200).json({
      ...cart._doc,              
      walletBalance: walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};