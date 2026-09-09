import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import User from "@/models/User"

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // token verify karke role nikal rahe hain
    const decode = await  jwt.verify(token, process.env.JWT_SECRET);

    // sirf admin hi ye API use kar sake, warna reject kar do
    if (decode.role !== "admin") {
      return Response.json({ message: "access denied" }, { status: 403 });
    }

    // saare orders laa rahe hain (koi filter nahi, isliye khaali {})
    // saath mein product details aur order kisका hai (user) bhi populate kar rahe hain
    const orders = await Order.find({})
      .populate("items.product")
      .populate("user");

    return Response.json({ orders, message: "orders fetched" }, {status: 200});
  } catch (error) {
    console.error(error.message)
    return Response.json(
        {message: "failed to fetch orders"},
        {status: 500}
    )
  }
}
