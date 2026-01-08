"use client";

import { useState } from "react";

interface ImageGalleryProps {
  mainImage: string;
  allImages: string[];
  name: string;
}

export default function ImageGallery({ mainImage, allImages, name }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(mainImage);
  const images = allImages.length > 0 ? allImages : [mainImage];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails (Side) */}
      <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onMouseEnter={() => setActiveImage(img)}
            onFocus={() => setActiveImage(img)}
            tabIndex={0}
            className={`w-12 h-12 border ${activeImage === img ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'} rounded p-1 cursor-pointer transition-all flex-shrink-0`}
          >
            <img src={img} alt="" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 order-1 lg:order-2 border border-gray-100 p-4 rounded flex justify-center bg-white min-h-[400px]">
        <img 
          src={activeImage} 
          alt={name}
          className="max-h-[500px] object-contain transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
