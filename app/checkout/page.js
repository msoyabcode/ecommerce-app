"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.cart);
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const total = cart
    ? cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    : 0;

  const handlePlaceOrder = async () => {
    const paymentsRes = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const paymentData = await paymentsRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: paymentData.order.amount,
      currency: "INR",
      order_id: paymentData.order.id,
      name: "ShopKart",
      description: "Order Payment",
      handler: async function (response) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingAddress: address }),
        });
        if (res.ok) {
          alert("Order placed successfully!");
          window.location.href = "/";
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

        {!cart || cart.items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-800">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-emerald-600">₹{item.product.price}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shipping Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full delivery address"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-2xl font-bold text-emerald-600">₹{total}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
      >
        Pay ₹{total} & Place Order
      </button>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";

// export default function CheckoutPage() {
//   const [cart, setCart] = useState(null);
//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     const fetchCart = async () => {
//       const res = await fetch("/api/cart");
//       const data = await res.json();
//       setCart(data.cart);
//     };
//     fetchCart();
//   }, []);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     document.body.appendChild(script);
//   }, []);

//   const handlePlaceOrder = async () => {
//     const paymentsRes = await fetch("/api/payment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount: total }),
//     });
//     const paymentData = await paymentsRes.json();

//     // Razorpay ka payment popup kholने ke liye options
//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
//       amount: paymentData.order.amount,
//       currency: "INR",
//       order_id: paymentData.order.id,
//       name: "ShopKart",
//       description: "Order Payment",
//       handler: async function (response) {
//         // payment successful hone ke baad, hamara actual order place kar rahe hain
//         const res = await fetch("/api/orders", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ shippingAddress: address }),
//         });
//         if (res.ok) {
//           alert("Order placed successfully!");
//           window.location.href = "/";
//         }
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       },
//     };

//     const total = cart
//       ? cart.items.reduce(
//           (sum, item) => sum + item.product.price * item.quantity,
//           0,
//         )
//       : 0;

//     return (
//       <div className="max-w-3xl mx-auto p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             Order Summary
//           </h2>

//           {!cart || cart.items.length === 0 ? (
//             <p className="text-gray-500">Your cart is empty</p>
//           ) : (
//             cart.items.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
//               >
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     {item.product.name}
//                   </p>
//                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                 </div>
//                 <p className="font-semibold text-emerald-600">
//                   ₹{item.product.price}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Shipping Address
//           </label>
//           <input
//             type="text"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             placeholder="Enter your full delivery address"
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between mb-6">
//           <span className="text-lg font-semibold text-gray-800">Total</span>
//           <span className="text-2xl font-bold text-emerald-600">₹{total}</span>
//         </div>

//         <button
//           onClick={handlePlaceOrder}
//           className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
//         >
//           Pay ₹{total} & Place Order
//         </button>
//       </div>
//     );
//   };
// }
