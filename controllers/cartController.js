const Cart = require('../models/Cart');

exports.syncCart = async (req, res) => {
const { userId, cartItems } = req.body;
try{
let cart = await Cart.findOne({ userId });
if(cart){
cart.items = cartItems;
await cart.save();
}else{
cart = await Cart.create({ userId, items: cartItems }); 
}
res.status(200).json({ success: true, cart });
}
catch(error){
res.status(500).json({ message: "Server Error sync cart", error: error.message });  
}
};


exports.getCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};