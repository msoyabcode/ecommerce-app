"use client";
import { useEffect, useState } from "react";

export default function () {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.cart);
    };
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    const res = await fetch(`/api/cart?productId=${productId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      setCart(data.cart);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity: newQuantity }),
    });
    const data = await res.json();
    if (res.ok) {
      setCart(data.cart);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {item.product.name}
                </p>
                <p className="text-emerald-600 font-bold">
                  ₹{item.product.price}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600">Quantity</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-md px-2 py-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1)
                    }
                    className="text-lg font-bold text-slate-700 hover:text-emerald-600"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1)
                    }
                    className="text-lg font-bold text-slate-700 hover:text-emerald-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.product._id)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
