import { useState, useEffect } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]); // Placeholder for future save-for-later logic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "2"; // Hardcoded for now, replace with dynamic user id if available

  const deliveryAddress = {
    location: "Sample address",
  };

  useEffect(() => {
    async function fetchCartAndProducts() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all carts
        const cartRes = await fetch(
          "https://flipkart-backend-7zx7.onrender.com/api/cart/all"
        );
        const cartData = await cartRes.json();
        if (!cartData.success) throw new Error("Failed to fetch carts");
        // Find all carts for the current user and merge their items
        const userCarts = Array.isArray(cartData.data)
          ? cartData.data.filter((c) => c.userId === userId)
          : [];
        // Flatten all items from all carts
        let cartItemsRaw = [];
        userCarts.forEach((cart) => {
          if (Array.isArray(cart.items)) {
            cart.items.forEach((item) => {
              cartItemsRaw.push(item);
            });
          }
        });
        // Combine quantities for duplicate productIds
        const combinedItemsMap = {};
        cartItemsRaw.forEach((item) => {
          const key = String(item.productId);
          if (combinedItemsMap[key]) {
            combinedItemsMap[key].quantity += item.quantity || 1;
          } else {
            combinedItemsMap[key] = { ...item };
          }
        });
        const combinedCartItemsRaw = Object.values(combinedItemsMap);

        // Fetch all products
        const prodRes = await fetch(
          "https://flipkart-backend-7zx7.onrender.com/api/product/all"
        );
        const productsResponse = await prodRes.json();
        // Robustly flatten all nested products arrays
        let allProducts = [];
        if (Array.isArray(productsResponse)) {
          productsResponse.forEach((doc) => {
            if (Array.isArray(doc.products)) {
              allProducts = allProducts.concat(doc.products);
            }
          });
        }

        // Merge cart items with product details
        const mergedCartItems = combinedCartItemsRaw.map((item) => {
          // Match productId (from cart) to product.id (from products)
          const product = allProducts.find(
            (p) => String(p.id) === String(item.productId)
          );
          return product
            ? {
                ...product,
                quantity: item.quantity || 1,
                productId: item.productId,
              }
            : {
                productId: item.productId,
                quantity: item.quantity || 1,
                missing: true,
              };
        });
        setCartItems(mergedCartItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCartAndProducts();
  }, []);

  const handleQuantity = (idx, delta) => {
    const items = [...cartItems];
    if ((items[idx].quantity || 1) + delta > 0) {
      items[idx].quantity = (items[idx].quantity || 1) + delta;
      setCartItems(items);
    }
  };

  const handleRemove = (idx) => {
    const items = [...cartItems];
    items.splice(idx, 1);
    setCartItems(items);
  };

  // Pricing logic (fallbacks for missing product info)
  const price = cartItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice || item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = cartItems.reduce(
    (sum, item) =>
      sum +
      ((item.originalPrice || item.price || 0) - (item.price || 0)) *
        (item.quantity || 1),
    0
  );
  const platformFee = 4;
  const total = price - discount + platformFee;

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
  <div className="bg-gray-50 min-h-screen py-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 px-4">
      {/* Left: Cart Items */}
      <div className="flex-1">
        {/* Address Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between mb-4 border border-gray-200">
          <span className="text-sm text-gray-600">
            Deliver to:{" "}
            <span className="font-semibold text-blue-700">
              {deliveryAddress.location}
            </span>
          </span>
          <button className="text-blue-600 border border-blue-500 px-3 py-1 text-sm rounded hover:bg-blue-50 transition">
            Change
          </button>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 && (
          <div className="bg-white text-center text-gray-500 rounded-lg p-12 shadow-sm">
            🛒 Your cart is empty.
          </div>
        )}

        {/* Cart Items List */}
        {cartItems.map((item, idx) => (
          <div
            key={item.productId || idx}
            className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-28 object-cover rounded border"
                />
              ) : (
                <div className="w-24 h-28 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-sm">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.title || "Unknown Product"}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Size: {item.size || "—"}
                </p>
                <p className="text-xs text-gray-400">
                  Seller: {item.seller || "FlipkartVendor"}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  Delivery by Sat, Jul 26
                </p>

                <div className="flex items-center gap-2 mb-2">
                  {item.originalPrice && (
                    <span className="line-through text-sm text-gray-400">
                      ₹{item.originalPrice}
                    </span>
                  )}
                  <span className="text-lg font-semibold text-gray-800">
                    ₹{item.price || "--"}
                  </span>
                  {item.discountPercentage && (
                    <span className="text-green-600 text-sm font-medium">
                      {item.discountPercentage}% Off
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Or Pay ₹
                  {item.price ? Math.round(item.price * 0.95) : "--"} +{" "}
                  <span className="text-yellow-600 font-semibold">28</span>
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => handleQuantity(idx, -1)}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-sm">{item.quantity || 1}</span>
                  <button
                    onClick={() => handleQuantity(idx, 1)}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-4 text-sm text-blue-600 mt-3">
                  <button
                    onClick={() => handleRemove(idx)}
                    className="hover:underline"
                  >
                    Remove
                  </button>
                  <span className="text-gray-400">|</span>
                  <button className="hover:underline">Save for later</button>
                </div>

                {item.missing && (
                  <p className="text-xs text-red-500 mt-2">
                    Product details not found.
                  </p>
                )}
              </div>
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-bold mt-4 md:mt-0 self-end md:self-center transition">
              PLACE ORDER
            </button>
          </div>
        ))}
      </div>

      {/* Right: Price Summary */}
      <div className="w-full md:w-80">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">PRICE DETAILS</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>
              Price ({cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""})
            </span>
            <span>₹{price}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Discount</span>
            <span className="text-green-600">− ₹{discount}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-base font-semibold mb-2">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            You will save ₹{discount} on this order
          </p>
        </div>
      </div>
    </div>
  </div>
);

}

export default Cart;
