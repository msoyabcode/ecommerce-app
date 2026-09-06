"use client";

import { Search, User, ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function () {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-8 py-3 shadow-md gap-6">
      <div className="text-white text-2xl font-bold tracking-tight">
        Shop <span className="text-emerald-400">kart</span>
      </div>

      <div className="flex-1 max-w-xl flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-md border border-slate-800">
        <Search size={18} className="text-slate-400" />
        <input
          className="text-white flex-1 text-sm placeholder-slate-400 bg-transparent outline-none"
          type="text"
          placeholder="Search for production, brands and more"
        />
      </div>

      <div className="text-slate-200 flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors">
            <User size={20} />
            <span
              onClick={handleLogout}
              className="text-sm font-medium cursor-pointer"
            >
              Logout
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors"
          >
            <User size={20} />
            <span className="text-sm font-medium">Login</span>
          </Link>
        )}

        <Link
          href="/orders"
          className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors"
        >
          <Package size={20} />
          <span className="text-sm font-medium">Orders</span>
        </Link>

        <Link
          href="/cart"
          className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors"
        >
          <ShoppingCart size={20} />
          <span className="text-sm font-medium">Cart</span>
        </Link>

        {user && user.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors"
          >
            <span className="text-sm font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
