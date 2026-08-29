"use client"

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter()
    const [data, setData] = useState({ })

    const handleChange = (e) =>{
        setData({
            ...data,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const postData = await fetch("/api/auth/signup",{
            method: "POST",
            headers:{
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
        const resdata = await postData.json()
        console.log(resdata)
        if(postData.ok){
            router.push("/login")
        }

    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
      onSubmit={handleSubmit}
       className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        <h1 className="text-slate-900 flex justify-center text-2xl font-bold mb-1">Sign up</h1>
        <p className="text-slate-500 flex justify-center text-sm mb-6">
          Join ShopKart and start shopping
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
        onChange={handleChange}
        id = "name"
          type="text"
          placeholder="enter your name"
          className="w-full px-4 py-2.5 mb-4 border border-slate-300 rounded-lg text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
        onChange={handleChange}
        id="email"
          type="email"
          placeholder="enter your email"
          className="w-full px-4 py-2.5 mb-4 border border-slate-300 rounded-lg text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
        onChange={handleChange}
        id="password"
          type="password"
          placeholder="enter your password"
          className="w-full px-4 py-2.5 mb-6 border border-slate-300 rounded-lg text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Sign Up
        </button>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}