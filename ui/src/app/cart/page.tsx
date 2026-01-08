"use client";

import { updateCartItem, deleteCartItem } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, refreshCart } = useCart();
  const router = useRouter();

  const handleUpdateQty = async (id: number, qty: number) => {
    try {
      if (qty <= 0) {
        await deleteCartItem(id);
      } else {
        await updateCartItem(id, qty);
      }
      refreshCart();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCartItem(id);
      refreshCart();
      toast.success("Item removed");
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-[#eaeded] min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-medium border-b border-gray-200 pb-4 mb-4">Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xl mb-4">Your Amazon Cart is empty.</p>
              <Link href="/" className="text-cyan-600 hover:underline">Continue shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-6 last:border-0">
                  <Link href={`/products/${item.product.id}`} className="w-44 h-44 flex-shrink-0">
                    <img src={item.product.image_main} alt={item.product.name} className="w-full h-full object-contain" />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                       <Link href={`/products/${item.product.id}`} className="text-lg font-medium hover:text-orange-700 line-clamp-2 leading-snug">
                         {item.product.name}
                       </Link>
                       <span className="text-lg font-bold whitespace-nowrap">₹{item.product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">In Stock</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-gray-100 border border-gray-300 rounded shadow-sm px-2">
                        <label className="text-xs mr-2">Qty:</label>
                        <select 
                          className="bg-transparent focus:outline-none text-sm py-1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </div>
                      <span className="h-4 border-l border-gray-300"></span>
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-cyan-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right text-lg">
                Subtotal ({cart.length} items): <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="w-full lg:w-72 flex flex-col gap-4">
            <div className="bg-white p-4 shadow-sm flex flex-col gap-4">
               <div>
                 <span className="text-lg">Subtotal ({cart.length} items): <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span></span>
               </div>
               <div className="flex items-center gap-2 text-sm">
                 <input type="checkbox" id="gift" />
                 <label htmlFor="gift">This order contains a gift</label>
               </div>
               <button 
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-lg text-sm transition-colors shadow-sm"
               >
                 Proceed to Buy
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
