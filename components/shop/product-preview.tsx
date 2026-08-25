"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveCdnUrl } from "@/lib/shop-utils";

interface ProductPreviewProps {
  formData: any;
  imageUrl?: string | null;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
};

export function ProductPreview({ formData, imageUrl }: ProductPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    formData.images && formData.images.length > 0
      ? formData.images
      : formData.image
        ? [formData.image]
        : imageUrl
          ? [imageUrl]
          : [`https://cdn.thrico.network/shop_product_clothing.png`];

  const displayImage = resolveCdnUrl(images[currentImageIndex]);
  const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || "$";
  const isOutOfStock = formData.isOutOfStock;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full bg-[#e1e3e5] dark:bg-zinc-800 overflow-hidden">
        <Image
          src={displayImage}
          alt="Product preview"
          fill
          className={cn(
            "object-cover transition-transform duration-500 hover:scale-105",
            isOutOfStock && "grayscale opacity-80",
          )}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isOutOfStock ? (
            <Badge
              variant="destructive"
              className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
            >
              Out of Stock
            </Badge>
          ) : (
            <Badge className="bg-black/75 text-white backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
              Available
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        {formData.price && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2.5 py-1 rounded-[6px] bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 backdrop-blur-xs text-[12px] font-bold shadow-xs">
              {currencySymbol}
              {formData.price}
            </span>
          </div>
        )}

        {/* Carousel Controls */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-xs"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-xs"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 space-y-2">
        <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
          {formData.title || "Product Title"}
        </h4>
        <p className="text-[12px] text-[#616161] dark:text-zinc-400 line-clamp-2 leading-[16px]">
          {formData.description ||
            "Product specifications and overview will appear here..."}
        </p>
      </div>
    </div>
  );
}
