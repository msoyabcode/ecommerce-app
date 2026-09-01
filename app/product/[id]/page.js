"use client"

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams();
  const [product, setProduct] = useState(null)

  useEffect(()=>{
    const fetchProduct = async () =>{
      const res = await fetch(`http://localhost:3000/api/product/${id}`);
      const data = await res.json();
      setProduct(data.product)
    }
    fetchProduct()
  },[id])

  const handleAddtoCart = async () =>{
    const res = await fetch("/api/cart",{
      method: 'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({productId: id, quantity: 1})
    })
    if(res.ok){
      router.push("/cart")
    }
  }

  if(!product) return <div className="p-8">Loading...</div>
  return (
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-2 gap-8">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-600 mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.description}</p>
        <p className="text-3xl font-bold text-emerald-600 mb-6">₹{product.price}</p>
        <button 
        onClick={handleAddtoCart}
        className="w-full bg-slate-900 text-white py-3 rounded-md hover:bg-slate-800 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}