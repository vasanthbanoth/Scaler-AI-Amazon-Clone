"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";
import { Order } from "@/types/backend";
import { toast } from "sonner";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="bg-[#eaeded] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:underline">Your Account</Link>
          <ChevronRight size={14} />
          <span className="text-[#c45500]">Your Orders</span>
        </div>
        
        <h1 className="text-3xl font-medium">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded shadow-sm border border-gray-200">
            <p className="text-lg">You haven't placed any orders yet.</p>
            <Link href="/" className="text-cyan-600 hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-[#f0f2f2] px-6 py-4 flex flex-wrap justify-between gap-4 text-xs text-gray-600 border-b border-gray-200">
                   <div className="flex gap-8">
                     <div className="flex flex-col gap-1">
                       <span className="uppercase">Order Placed</span>
                       <span className="text-sm text-black">{new Date(order.created_at).toLocaleDateString()}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="uppercase">Total</span>
                       <span className="text-sm text-black font-bold">₹{order.total_amount.toLocaleString("en-IN")}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="uppercase">Ship To</span>
                       <span className="text-sm text-cyan-600 hover:text-orange-700 hover:underline cursor-pointer">Default User</span>
                     </div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     <span>ORDER # {order.id}</span>
                     <div className="flex gap-2 text-cyan-600">
                       <Link href={`/orders/${order.id}`} className="hover:text-orange-700 hover:underline">View order details</Link>
                       <span>|</span>
                       <span className="hover:text-orange-700 hover:underline cursor-pointer">Invoice</span>
                     </div>
                   </div>
                </div>
                
                {/* Order Status */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">{order.status}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package size={20} className="text-green-600" />
                    <span>Package was handed off to resident</span>
                  </div>
                  
                  {/* Simplified view since minimal info is returned */}
                  <div className="mt-4">
                     <Link 
                      href={`/orders/${order.id}`}
                      className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-1.5 rounded-lg text-sm transition-colors shadow-sm"
                     >
                       Track package
                     </Link>
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
