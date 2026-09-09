import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"



export async function PUT(req, {params}){
    try{

        await dbConnect()

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

          // sirf admin hi status update kar sake
        if(decode.role !== "admin"){
            return Response.json(
                {message: "access denied"},
                {status: 403}
            )
        }

        // URL se us order ki ID nikal rahe hain jise update karna hai
        const {id} = await params

        // body se naya status le rahe hain (jaise "shipped")
        const {status} = await req.json()

        // order ko dhoondh ke, uski status ek saath update kar rahe hain
       // {new: true} isliye taaki updated document wapas mile (purana nahi)
       const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {status},
        {new: true}
       )

       if(!updatedOrder){
        return Response.json(
            {message: "order not found"},
            {status: 404}
        )
       }

       return Response.json(
        {order: updatedOrder, message: "status updated"},
        {status: 200}
       )


    }catch(error){
        console.error(error.message)
        return Response.json(
            {message: "failed to update status"},
            {status: 500}
        )
    }
}