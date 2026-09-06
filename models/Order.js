import mongoose from "mongoose";
import Product from "./Product";

const orderShema = new mongoose.Schema(
  {
    // kis user ka order hai  - User model se reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    items: [
      {
        // order mein kon se product hai, kitni quantity hai, aur us time ka price
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        // price yahan store kar rahe hain (Cart mein nahi tha) — taaki
        // agar future mein product ka price badal jaye, purane order ka
        // amount wahi rahe jo order karte waqt tha
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    // pure order ka total amount
    totalAmount: {
      type: Number,
      required: true,
    },
    // delivery address, simple text ke roop mein
    shippingAddress: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderShema);

export default Order;
