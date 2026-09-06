"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAdmin(data.user);
      if (data.user.role !== "admin") {
        router.push("/");
      }
    };

    fetchMe();
  }, []);

  const handleChange = async (e) =>{
    setFormData({...formData,
        [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const res = await fetch("/api/products",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({...formData, images: [formData.images]})
    })
  }


  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

      <form   onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
          onChange={handleChange}
          id="name"
            type="text"
            placeholder="Product name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
          onChange={handleChange}
          id="description"
            placeholder="Product description"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
          onChange={handleChange}
          id="price"
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
          onChange={handleChange}
          id="images"
            type="text"
            placeholder="https://..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
          onChange={handleChange}
          id="category"
            type="text"
            placeholder="Category"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
          onChange={handleChange}
          id="stock"
            type="number"
            placeholder="Stock quantity"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
