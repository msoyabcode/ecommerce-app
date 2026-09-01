import dbConnect from "@/lib/dbConnect"
import Product from "@/models/Product"


export async function GET (req, {params}){
    try{

    const {id} = await params

    await dbConnect()
     
    const product = await Product.findById(id)
    if(!product){
        return Response.json(
            {message: "product not found"},
            {status: 404}
        )
    }

    return Response.json(
        {product},
        {status: 200}
    )

    }catch(error){
        console.error(error.message)
        return Response.json(
            {message: "failed to fetch product"},
            {status: 500}
        )
    }

}