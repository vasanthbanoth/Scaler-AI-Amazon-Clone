import { getProduct, addToCart } from "@/lib/api";
import { Product } from "@/types/backend";
import { ShoppingCart, Bolt } from "lucide-react";
import Link from "next/link";
import ProductDetailActions from "@/components/ProductDetailActions";
import ImageGallery from "@/components/ImageGallery";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product: Product = await getProduct(id);

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Left: Images Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-4">
              <ImageGallery 
                mainImage={product.image_main} 
                allImages={product.images} 
                name={product.name} 
              />
            </div>
          </div>

          {/* Middle: Details */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h1 className="text-2xl font-medium leading-tight">{product.name}</h1>
            <Link href={`/?category=${product.category}`} className="text-sm text-cyan-600 hover:text-orange-700 hover:underline">
              Visit the {product.category} Store
            </Link>
            
            <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
               <span className="text-yellow-500">★★★★☆</span>
               <span className="text-sm text-cyan-600">4.1 ratings</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-200 pb-4">
              <div className="flex items-start gap-1">
                <span className="text-xs mt-1">₹</span>
                <span className="text-2xl font-semibold">{product.price.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-sm">About this item</h2>
              <p className="text-sm leading-relaxed">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-y-2 pt-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <span className="text-sm font-bold">{key}</span>
                    <span className="text-sm">{value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="lg:col-span-3">
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 sticky top-4">
               <div className="flex items-start gap-1">
                  <span className="text-xs mt-1">₹</span>
                  <span className="text-2xl font-semibold">{product.price.toLocaleString("en-IN")}</span>
               </div>
               
               <p className="text-sm text-cyan-600">FREE delivery <span className="text-black font-bold">Tomorrow</span>. Order within 4 hrs.</p>
               
               <p className={`text-lg font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                 {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
               </p>

               <ProductDetailActions 
                productId={product.id} 
                stock={product.stock}
               />
               
               <div className="text-xs text-gray-500 mt-2">
                 <div className="flex justify-between">
                   <span>Ships from</span>
                   <span className="text-black">Amazon</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Sold by</span>
                   <span className="text-black">Appario Retail Private Ltd</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React from "react";
