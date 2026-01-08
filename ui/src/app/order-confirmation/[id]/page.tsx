"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = use(params);

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-xl mx-auto border border-gray-200 rounded-lg p-8 shadow-sm text-center flex flex-col items-center">
        <CheckCircle size={64} className="text-green-600 mb-4" />
        <h1 className="text-2xl font-bold text-green-700 mb-2">Order Placed, Thank You!</h1>
        <p className="text-gray-600 mb-6">Your order #<span className="font-bold">{id}</span> has been successfully placed.</p>
        
        <div className="w-full flex flex-col gap-3">
           <Link 
            href="/"
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-lg text-sm font-medium shadow-sm text-center"
           >
             Continue Shopping
           </Link>
           <p className="text-xs text-gray-500">
             An email confirmation has been sent to you. Shipping updates will follow.
           </p>
        </div>
      </div>
    </div>
  );
}
