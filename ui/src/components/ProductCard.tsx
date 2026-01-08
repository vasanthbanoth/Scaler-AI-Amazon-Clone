"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/backend";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItemToCart, removeItemFromCart, isInCart, toggleWishlist, isInWishlist } = useCart();
  const alreadyInCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (alreadyInCart) {
      await removeItemFromCart(product.id);
    } else {
      await addItemToCart(product.id, 1);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product.id);
  };

  return (
    <div className="bg-white flex flex-col p-4 border border-gray-200 hover:shadow-lg transition-shadow relative group">
      {/* Wishlist Toggle */}
      <button 
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full hover:bg-white shadow-sm border border-transparent hover:border-gray-200 transition-all"
      >
        <Heart size={18} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
        <div className="relative h-48 w-full mb-4 group-hover:scale-105 transition-transform duration-300">
          <img
            src={product.image_main}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-sm font-medium line-clamp-2 hover:text-orange-700 h-10 mb-2">
          {product.name}
        </h3>
        
        {/* Mock ratings */}
        <div className="flex items-center mb-1 text-xs">
          <span className="text-[#de7921] mr-1 font-bold">4.0</span>
          <span className="text-yellow-500">★★★★☆</span>
          <span className="text-blue-600 ml-1 hover:text-orange-700">1,234</span>
        </div>

        <div className="flex items-start gap-0.5 mt-auto">
          <span className="text-xs font-semibold">₹</span>
          <span className="text-2xl font-bold">
            {product.price.toLocaleString("en-IN")}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-4">M.R.P: <span className="line-through">₹{(product.price * 1.2).toFixed(0)}</span></p>

        <button 
          onClick={handleCartClick}
          className={`w-full py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
            alreadyInCart 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-[#ffd814] hover:bg-[#f7ca00] text-black"
          }`}
        >
          {alreadyInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </Link>
    </div>
  );
}
