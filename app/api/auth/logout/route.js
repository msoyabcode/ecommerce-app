import { cookies } from "next/headers";


export async function POST(req){
    try{
        const cookieStore = await cookies()
        cookieStore.delete("token")

        return Response.json(
            {message: "token is deleted"},
            {status: 200}
        )
    }catch(error){
        console.error(error.message)
        return Response.json(
            {message: "something went wrong"},
            {status: 500}
        )
    }

}