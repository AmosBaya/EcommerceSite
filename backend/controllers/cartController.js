const Cart = require('../models/Cart');


exports.addInCart = async (req,res)=>{
    try {
        const { user, productId, quantity=1 }= req.body;

        if(!productId || !user){
            return res.status(400).json({message:"User and productId required"})
        }

        let cart = await Cart.findOne({ userId: user, status: "active" });

        if (!cart) {
            cart = new Cart({ userId: user, items: [], status: "active" });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({
                productId,
                quantity: parseInt(quantity),
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Item added to cart",
            data: cart,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to add item to cart",
            error: err.message,
        });
    }
}

exports.getCarts = async (req,res)=>{
    try {
    const carts = await Cart.find({});

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (err) {
    console.error("Error fetching carts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart data",
      error: err.message,
    });
  }
}


// DELETE /api/cart/delete
exports.deleteItemFromCart = async (req, res) => {
  try {
    const { user, productId } = req.body;

    if (!user || !productId) {
      return res.status(400).json({ message: "User and productId are required" });
    }

    // Find active cart for the user
    const cart = await Cart.findOne({ userId: user, status: "active" });

    if (!cart) {
      return res.status(404).json({ message: "No active cart found for the user" });
    }

    // Check if the product exists in the cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: err.message
    });
  }
};

