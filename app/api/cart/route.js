import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Car } from "lucide-react";

export async function POST(req) {
  try {
    // login user ka token cookie se nikal rahe hain
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // token verify karke uske andar se userId nikal rahe hain
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId;

    // frontend se product ki ID aur quantity le rahe hain
    const { productId, quantity } = await req.json();

    // check kar rahe hain is user ka cart pehle se database mein hai kya
    const isUserExist = await Cart.findOne({ user: userId });

    if (!isUserExist) {
      // cart nahi tha, naya cart bana rahe hain isi product ke saath
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
      return Response.json({ cart: newCart, message: "added to cart" }, { status: 201 });
    } else {
      // cart already hai, check kar rahe hain ye product usme already hai kya
      const itemIndex = isUserExist.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // product already cart mein hai, sirf quantity badha rahe hain
        isUserExist.items[itemIndex].quantity += quantity || 1;
      } else {
        // naya product hai, cart ke items array mein push kar rahe hain
        isUserExist.items.push({ product: productId, quantity: quantity || 1 });
      }

      // changes ko database mein save kar rahe hain
      await isUserExist.save();
      return Response.json({ cart: isUserExist, message: "cart updated" }, { status: 200 });
    }
  } catch (error) {
    // kuch bhi galat hone par (invalid token, DB error, etc.) yahan pakड़ा jayega
    console.error(error.message);
    return Response.json({ message: "failed to add to cart" }, { status: 500 });
  }
}



export async function GET (req){
    try{

            const cookieStore = await cookies()
            const token = await cookieStore.get("token")?.value

            const decode = await jwt.verify(token, process.env.JWT_SECRET)

            const userId = decode.userId

            const cart = await Cart.findOne({user: userId}).populate("items.product")
            if(!cart){
                return Response.json(
                    {items: []},
                    {status: 200}   
                )
            }else{
                return Response.json(
                    {cart,
                    message: "cart fetched"},
                    { status: 200}
                )
            }

    }catch(error){
        console.error("error.message")
        return Response.json(
            {message: "failed to fetch cart"},
            {status: 500}
        )
    }

}



// quantity increase and decrease krne ke liye 
export async function PUT (req){
  try{

     // login user ka token cookie se nikal rahe hain
    const cookiStore = await cookies()
    const token = cookiStore.get("token")?.value

    // token verify karke userId nikal rahe hain
    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.userId

    // frontend se product ID aur naya quantity le rahe hain
    const {productId, quantity} = await req.json()

    // is user ka cart dhoondh rahe hain
    const cart = await Cart.findOne({user: userId})
    if(!cart){
      return Response.json(
        {message: "cart not found"},
        {status: 404}
      )
    }

    // cart ke items mein ye product dhoondh rahe hain
    const itemIndex = cart.items.findIndex((item) =>
      item.product.toString() === productId
    )
    if(itemIndex === -1){
      return Response.json(
        {message: "item not in cart"},
        {status: 404}
      )
    }

    // uski quantity naye value se replace kar rahe hain
    cart.items[itemIndex].quantity = quantity

    // changes ko database mein save kar rahe hain
    await cart.save();
    await cart.populate("items.product")

    return Response.json(
      {cart,
      message: "cart updated"},
      {status: 200}
    )

  }catch(error){
    console.error(error.message)
    return Response.json(
      {message: "failed to update cart"},
      {status: 500}
    )
  }
}



// Ab remove item ke liye DELETE function.

export async function DELETE (req){
  try{

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    const userId = decode.userId

    // URL ke query parameter se productId nikal rahe hain
    const {searchParams} = new URL(req.url)
    const productId = searchParams.get("productId")

    // user ka cart dhoondh rahe hain
    const cart = await Cart.findOne({user: userId})
    if(!cart){
      return Response.json(
        {message: "cart not found"},
        {status: 404}
      )
    }

    // jo product match nahi karta, sirf wahi items rakh rahe hain (matching wala hat gaya)
    cart.items =  cart.items.filter((item) =>
      item.product.toString() !== productId
    )

    await cart.save()
    await cart.populate("items.product")

    return Response.json(
      {cart, 
        message: "item rmoved"},
        {status: 200}
    )
  }catch(error){
    console.error(error.message)
    return Response.json(
      {message: "failed to remove item"},
      {status: 500}
    )
  }
}