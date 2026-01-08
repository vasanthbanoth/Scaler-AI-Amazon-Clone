"use client";

import Link from "next/link";
import { Search, ShoppingCart, MapPin, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search)}`);
    } else {
      router.push("/");
    }
  };

  const categories = ["Electronics", "Books", "Prime", "Home & Kitchen", "Fashion"];

  return (
    <header className="flex flex-col">
      {/* Top Nav */}
      <div className="bg-[#131921] text-white px-4 py-2 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center pt-2 px-2 border border-transparent hover:border-white">
          <span className="text-2xl font-bold tracking-tighter">amazon<span className="text-[#febd69]">.clone</span></span>
        </Link>

        {/* Deliver To */}
        <div className="hidden lg:flex flex-col px-2 py-1 border border-transparent hover:border-white cursor-pointer">
          <span className="text-xs text-gray-300 ml-5">Deliver to</span>
          <div className="flex items-center font-bold text-sm">
            <MapPin size={18} className="mr-1" />
            <span>India</span>
          </div>
        </div>

        {/* Search Bar - Fixed Contrast */}
        <form onSubmit={handleSearch} className="flex-1 flex h-10 group">
          <select className="bg-[#f3f3f3] text-[#555] text-xs px-2 rounded-l-md border-r border-gray-300 focus:outline-none hover:bg-gray-200 cursor-pointer">
            <option>All</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="text"
            className="flex-1 px-3 text-black focus:outline-none bg-white placeholder-gray-500"
            placeholder="Search Amazon.clone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 rounded-r-md text-black transition-colors">
            <Search size={22} />
          </button>
        </form>

        {/* Right side items */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/wishlist" className="flex flex-col px-2 py-1 border border-transparent hover:border-white cursor-pointer group">
            <div className="flex items-center gap-1">
              <Heart size={18} className="text-gray-300 group-hover:text-white" />
              <span className="text-sm font-bold">Wishlist</span>
            </div>
          </Link>

          <Link href="/orders" className="flex flex-col px-2 py-1 border border-transparent hover:border-white cursor-pointer">
            <span className="text-xs">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          <Link href="/cart" className="flex items-end px-2 py-1 border border-transparent hover:border-white gap-1">
            <div className="relative">
              <span className="absolute -top-1.5 -right-1.5 bg-[#f3a847] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
              <ShoppingCart size={32} />
            </div>
            <span className="text-sm font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Ribbon */}
      <div className="bg-[#232f3e] text-white px-4 py-1 flex items-center gap-4 text-sm">
        <div className="flex items-center font-bold px-2 py-1 border border-transparent hover:border-white cursor-pointer">
          <Menu size={20} className="mr-1" />
          All
        </div>
        {categories.map(cat => (
          <Link 
            key={cat} 
            href={`/?category=${encodeURIComponent(cat)}`}
            className="px-2 py-1 border border-transparent hover:border-white cursor-pointer truncate"
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}
