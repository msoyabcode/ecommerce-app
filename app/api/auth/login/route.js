import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST (req){
    try{

        await dbConnect()

        const {email, password} =  await req.json()

        const user = await User.findOne({email})
        if(!user){
            return Response.json(
                {message: "invalid credentials"},
                {status: 400 }
            )
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return Response.json(
                {message: "password is incorrect"},
                {status: 400}
            )
        }

        const token = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        const cookieStore = await cookies()
        cookieStore.set("token", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60*60*24*7,
        })

        return Response.json(
            {message: "Login successful"},
            {status: 200}
        )

    }catch(error){
        console.error(error.message)
        return Response.json(
            {message:"failed to Login"},
            {status: 500}
        )
    }
}