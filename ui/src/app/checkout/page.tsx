"use client";

import { useEffect, useState } from "react";
import { placeOrder } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const [address, setAddress] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    setIsPlacing(true);
    try {
      const order = await placeOrder(address);
      await refreshCart(); // Clear cart after order
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0 && !isPlacing) {
    return (
      <div className="p-10 text-center">
        <p>No items in cart to checkout.</p>
        <Link href="/" className="text-cyan-600">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout ({cart.length} items)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                 Shipping address
               </h2>
               <form id="order-form" onSubmit={handlePlaceOrder}>
                 <textarea 
                   className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-cyan-500 outline-none"
                   rows={3}
                   placeholder="Street, City, Zip, State"
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   required
                 />
               </form>
            </div>

            {/* Payment Method (Mock) */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 opacity-70">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                 Payment method
               </h2>
               <p className="text-sm">Pay on Delivery (Cash/Card)</p>
            </div>

            {/* Items Review */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                 Review items and shipping
               </h2>
               <div className="flex flex-col gap-4">
                 {cart.map(item => (
                   <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <img src={item.product.image_main} className="w-16 h-16 object-contain" alt="" />
                      <div className="flex-1">
                        <p className="text-sm font-bold truncate max-w-sm">{item.product.name}</p>
                        <p className="text-xs text-orange-700 font-bold">₹{item.product.price.toLocaleString("en-IN")}</p>
                        <p className="text-xs">Quantity: {item.quantity}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Order Summary Side */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col gap-4">
               <button 
                  type="submit"
                  form="order-form"
                  disabled={isPlacing}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-lg text-sm shadow-sm transition-colors disabled:bg-gray-200"
               >
                 {isPlacing ? "Placing..." : "Use this address"}
               </button>
               <p className="text-[10px] text-gray-500 text-center">
                 By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
               </p>
               <div className="border-t border-gray-200 pt-4">
                 <h3 className="font-bold text-sm mb-2">Order Summary</h3>
                 <div className="flex justify-between text-xs text-gray-600 mb-1">
                   <span>Items:</span>
                   <span>₹{subtotal.toLocaleString("en-IN")}</span>
                 </div>
                 <div className="flex justify-between text-xs text-gray-600 mb-1">
                   <span>Shipping & handling:</span>
                   <span>₹0.00</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-orange-700 border-t border-gray-100 mt-2 pt-2">
                   <span>Order Total:</span>
                   <span>₹{subtotal.toLocaleString("en-IN")}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
