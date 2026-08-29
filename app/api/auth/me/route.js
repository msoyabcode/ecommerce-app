import { cookies } from "next/headers";
import jwt from "jsonwebtoken"


export async function GET(req) {
  try {

    const cookiStore = await cookies();
    const tokenCookie = cookiStore.get("token");

    if(!tokenCookie){
        return Response.json(
            {user: null},
            {status: 200}
        )
    }

    const decode = await jwt.verify(tokenCookie.value, process.env.JWT_SECRET);

    return Response.json(
        {user: decode},
        {status: 200}
    )
  } catch (error){
    console.error(error.message)
    return Response.json(
        {user: null},
        {status: 200}
    )
  }
}
