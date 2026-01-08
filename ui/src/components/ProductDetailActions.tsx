"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Zap, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailActionsProps {
  productId: number;
  stock: number;
}

export default function ProductDetailActions({ productId, stock }: ProductDetailActionsProps) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const { addItemToCart, removeItemFromCart, isInCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(productId);
  const alreadyInCart = isInCart(productId);

  const handleCartClick = async () => {
    if (alreadyInCart) {
      await removeItemFromCart(productId);
    } else {
      await addItemToCart(productId, qty);
    }
  };

  const handleBuyNow = async () => {
    try {
       if (!alreadyInCart) {
         await addItemToCart(productId, qty);
       }
       router.push("/cart");
    } catch (err) {
       toast.error("Error processing request");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!alreadyInCart && (
        <div className="flex items-center gap-2">
          <label className="text-sm">Qty:</label>
          <select 
            className="border border-gray-300 rounded bg-gray-100 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {[...Array(Math.min(10, stock))].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
      )}

      <button 
        onClick={handleCartClick}
        disabled={stock <= 0}
        className={`w-full py-2 rounded-lg text-sm font-medium shadow-sm transition-colors disabled:bg-gray-200 ${
          alreadyInCart 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-[#ffd814] hover:bg-[#f7ca00] text-black"
        }`}
      >
        {alreadyInCart ? "Remove from Cart" : "Add to Cart"}
      </button>

      <button 
        onClick={handleBuyNow}
        disabled={stock <= 0}
        className="w-full bg-[#ffa41c] hover:bg-[#fa8914] text-black py-2 rounded-lg text-sm font-medium shadow-sm transition-colors disabled:bg-gray-200"
      >
        Buy Now
      </button>

      <div className="border-t border-gray-200 mt-2 pt-4">
        <button 
          onClick={() => toggleWishlist(productId)}
          className="flex items-center gap-2 text-sm text-cyan-600 hover:text-orange-700 hover:underline"
        >
          <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : ""} />
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
