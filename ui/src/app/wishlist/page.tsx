"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItemToCart } = useCart();

  return (
    <div className="bg-[#eaeded] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-medium border-b border-gray-300 pb-4">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white p-10 text-center rounded shadow-sm">
            <p className="text-lg">Your wishlist is empty.</p>
            <Link href="/" className="text-cyan-600 hover:underline">Go find some favorites!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded shadow-sm border border-gray-200 flex gap-4 group">
                <Link href={`/products/${item.product.id}`} className="w-32 h-32 flex-shrink-0">
                  <img src={item.product.image_main} className="w-full h-full object-contain" alt="" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link href={`/products/${item.product.id}`} className="text-sm font-medium hover:text-orange-700 line-clamp-2">
                    {item.product.name}
                  </Link>
                  <div className="mt-2 text-lg font-bold">₹{item.product.price.toLocaleString("en-IN")}</div>
                  
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => addItemToCart(item.product.id, 1)}
                      className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-black py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button 
                      onClick={() => toggleWishlist(item.product.id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
