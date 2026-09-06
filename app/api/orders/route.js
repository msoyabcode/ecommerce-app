import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";


export async function POST(req){
try{

    await dbConnect() 

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.userId

    const cart = await Cart.findOne({user: userId}).populate("items.product")
    if(!cart || cart.items.length === 0){
        return Response.json(
            {message: "cart is empty"},
            {status: 400}
        )
    }
    // body se shipping address le rahe hain
    const {shippingAddress} = await req.json()

    // cart ke items ko order ke format mein convert kar rahe hain
    // (product ki ID, quantity, aur us waqt ka price)
    const orderItems = cart.items.map((item) =>({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
    }))

    // total amount calculate kar rahe hain — sab items ka (price × quantity) jodke
    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    // naya order database mein bana rahe hain
    const newOrder = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress
    })

    // order ban gaya, ab cart khaali kar rahe hain
    cart.items = []
    await cart.save()

    return Response.json(
        {order: newOrder, 
            message: "order placed successfully"},
            {status: 201}
    )

}catch(error){
    console.error(error.message)
    return Response.json(
        {message: "something went wrong"},
        {status: 500}
    )
}
}


export async function GET(req) {
    try{

        const cookieStore = await cookies()
        const token = await cookieStore.get("token")?.value
       
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const userId = decode.userId
         
        const orders = await Order.find({user: userId}).populate("items.product")

        return Response.json(
            {orders,
            message: "orders fetched"},
            {status: 200}
        )

    }catch(error){
        console.error(error.message)
        return Response.json(
            {message: "failed to fetch orders"},
            {status: 500}
        )
    }
}