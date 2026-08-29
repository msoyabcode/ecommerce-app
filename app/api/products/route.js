import dbConnect from "@/lib/dbConnect"
import Product from "@/models/Product"

export async function GET() {
    try {
        await dbConnect()
        const products = await Product.find()

        return Response.json({
            products,
            message: "all products are fetched successfully"
        })
    } catch (error) {
        console.error(error.message)
        return Response.json(
            { message: "failed to fetch products" },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        await dbConnect()
        const product = await Product.create(data)

        return Response.json(
            {
                product,
                message: "product is added"
            },
            { status: 201 }
        )
    } catch (error) {
        console.error(error.message)
        return Response.json(
            { message: "failed to post" },
            { status: 500 }
        )
    }
}