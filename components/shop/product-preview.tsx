"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag,
} from "lucide-react";
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
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
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
            <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0.5">
              Out of Stock
            </Badge>
          ) : (
            <Badge className="bg-black/60 text-white backdrop-blur-md border-none text-[10px] font-bold px-2 py-0.5">
              Available
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        {formData.price && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 backdrop-blur-md text-xs font-extrabold shadow-sm">
              {currencySymbol}{formData.price}
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
              className="h-7 w-7 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {formData.title || "Product Name"}
            </h3>
            {formData.category && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 capitalize flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {formData.category}
              </p>
            )}
          </div>
        </div>

        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {formData.description || "Product description will appear here..."}
        </p>

        {/* Variants Summary */}
        {formData.hasVariants && formData.options && formData.options.length > 0 && (
          <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-2.5 text-xs space-y-1.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-zinc-500">
              <ShoppingBag className="w-3 h-3" />
              <span>Configured Options</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.options.map((opt: any, idx: number) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  {opt.name}: {opt.values?.length || 0}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
