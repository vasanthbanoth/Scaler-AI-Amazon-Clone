"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart as apiAddToCart, deleteCartItem as apiDeleteCartItem, getWishlist, addToWishlist as apiAddToWishlist, deleteFromWishlist as apiDeleteFromWishlist } from "@/lib/api";
import { CartItem, WishlistItem } from "@/types/backend";
import { toast } from "sonner";

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addItemToCart: (productId: number, qty: number) => Promise<void>;
  removeItemFromCart: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  isInCart: (productId: number) => boolean;
  isInWishlist: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to refresh cart", err);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to refresh wishlist", err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const addItemToCart = async (productId: number, qty: number) => {
    try {
      await apiAddToCart(productId, qty);
      await refreshCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const removeItemFromCart = async (productId: number) => {
    try {
      const item = cart.find(i => i.product_id === productId);
      if (item) {
        await apiDeleteCartItem(item.id);
        await refreshCart();
        toast.success("Removed from cart");
      }
    } catch (err) {
      toast.error("Failed to remove from cart");
    }
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const existing = wishlist.find(i => i.product_id === productId);
      if (existing) {
        await apiDeleteFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await apiAddToWishlist(productId);
        toast.success("Added to wishlist");
      }
      await refreshWishlist();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const isInCart = (productId: number) => cart.some(i => i.product_id === productId);
  const isInWishlist = (productId: number) => wishlist.some(i => i.product_id === productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist, 
      cartCount, 
      refreshCart, 
      refreshWishlist,
      addItemToCart,
      removeItemFromCart,
      toggleWishlist,
      isInCart,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
