"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveCdnUrl, getCategoryDefaultImage } from "@/lib/shop-utils";

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

  // Consolidate images: prioritize form images array, then single image, then fallback
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
    <Card className="overflow-hidden border-border/50 shadow-lg transition-all hover:shadow-xl group">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
        <Image
          src={displayImage}
          alt="Product preview"
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            isOutOfStock && "grayscale opacity-80",
          )}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock && (
            <Badge variant="destructive" className="font-bold shadow-sm">
              Out of Stock
            </Badge>
          )}
          {!isOutOfStock && (
            <Badge className="bg-primary/90 hover:bg-primary shadow-sm font-semibold">
              New Arrival
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        {formData.price && (
          <div className="absolute bottom-3 right-3">
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-background/80 text-foreground border-border/50 shadow-sm text-lg px-3 py-1.5"
            >
              <span className="text-xs mr-1 text-muted-foreground align-top mt-0.5">
                {formData.currency}
              </span>
              {currencySymbol}
              {formData.price}
            </Badge>
          </div>
        )}

        {/* Carousel Controls */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-sm transition-all",
                  idx === currentImageIndex ? "bg-white w-3" : "bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-xl leading-tight truncate">
              {formData.title || "Product Name"}
            </h3>
            {formData.category && (
              <Badge
                variant="outline"
                className="text-[10px] shrink-0 uppercase tracking-wider"
              >
                {formData.category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">
            {formData.description || "Product description will appear here..."}
          </p>
        </div>

        {/* Variants Summary */}
        {formData.hasVariants && (
          <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-2 border border-border/50">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Options Available</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.options?.map((opt: any, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[10px] px-1.5 h-5 bg-background border-border/50"
                >
                  {opt.name}: {opt.values.length}
                </Badge>
              ))}
              {!formData.options?.length && (
                <span className="text-muted-foreground italic">
                  No options defined yet
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full gap-2 font-semibold shadow-sm"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Unavailable" : "Buy Now"}
          {!isOutOfStock && <ExternalLink className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
