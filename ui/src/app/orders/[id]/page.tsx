"use client";

import { use, useEffect, useState } from "react";
import { getOrder } from "@/lib/api";
import { Order } from "@/types/backend";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(() => toast.error("Failed to load order details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return <div className="p-10 text-center">Order not found</div>;

  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/orders" className="hover:underline">Your Orders</Link>
          <ChevronRight size={14} />
          <span className="text-[#c45500]">Order Details</span>
        </div>

        <h1 className="text-2xl font-bold">Order Details</h1>
        
        <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <span>Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
            <span className="text-gray-300">|</span>
            <span>Order # {order.id}</span>
          </div>
          <button className="text-cyan-600 hover:underline">View or Print invoice</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
           <div>
             <h3 className="font-bold text-sm mb-2">Shipping Address</h3>
             <p className="text-sm">Default User</p>
             <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.shipping_address}</p>
           </div>
           <div>
             <h3 className="font-bold text-sm mb-2">Payment Methods</h3>
             <p className="text-sm">Pay on Delivery (Cash/Card)</p>
           </div>
           <div>
             <h3 className="font-bold text-sm mb-2">Order Summary</h3>
             <div className="flex justify-between text-xs mb-1">
               <span>Item(s) Subtotal:</span>
               <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between text-xs mb-1">
               <span>Shipping:</span>
               <span>₹0.00</span>
             </div>
             <div className="flex justify-between font-bold text-sm mt-2 border-t border-gray-300 pt-2">
               <span>Grand Total:</span>
               <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
             </div>
           </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
           <div className="p-6">
              <h3 className="text-lg font-bold mb-4">{order.status}</h3>
              <div className="flex flex-col gap-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <Link href={`/products/${item.product.id}`} className="w-20 h-20 flex-shrink-0">
                      <img src={item.product.image_main} className="w-full h-full object-contain" alt="" />
                    </Link>
                    <div className="flex-1 flex flex-col gap-1">
                       <Link href={`/products/${item.product.id}`} className="text-sm font-medium text-cyan-600 hover:text-orange-700">
                         {item.product.name}
                       </Link>
                       <p className="text-xs text-gray-500">Sold by: Appario Retail Private Ltd</p>
                       <p className="text-xs text-orange-700 font-bold">₹{item.price_at_order.toLocaleString("en-IN")}</p>
                       <div className="flex gap-4 mt-2">
                          <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-4 py-1 rounded shadow-sm text-xs">Buy it again</button>
                          <button className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-1 rounded shadow-sm text-xs">Track package</button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
