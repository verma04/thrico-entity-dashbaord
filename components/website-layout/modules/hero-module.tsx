import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  HeroCarousel,
  HeroVideo,
  HeroSaasModern,
  HeroBentoGrid,
  HeroNewsletter,
} from "../modules";
import {
  HeroAppShowcase,
  HeroSingleImage,
  HeroSplit,
} from "../hero";

interface HeroModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function HeroModule({ module, previewDevice }: HeroModuleProps) {
  const { layout, content } = module;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        layout === "carousel" &&
          "bg-slate-900 text-white min-h-[500px] flex items-center",
        layout === "video" &&
          "relative min-h-[500px] flex items-center justify-center text-white overflow-hidden",
        layout === "saas-modern" && "bg-white py-24",
        layout === "bento-grid" && "bg-slate-50 py-20",
        layout === "split" && "p-12 flex flex-col justify-center min-h-[300px] flex-row items-center gap-8 bg-white",
        layout === "newsletter-focus" &&
          "bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-32 flex items-center justify-center",
        layout === "app-showcase" && "bg-white py-20"
      )}
    >
      {/* 1. CAROUSEL */}
      {layout === "carousel" && <HeroCarousel content={content} />}

      {/* 2. VIDEO */}
      {layout === "video" && <HeroVideo content={content} />}

      {/* 3. SAAS MODERN */}
      {layout === "saas-modern" && <HeroSaasModern content={content} />}

      {/* 4. BENTO GRID */}
      {layout === "bento-grid" && <HeroBentoGrid content={content} />}

      {/* 5. SPLIT */}
      {layout === "split" && <HeroSplit content={content} />}

      {/* 6. NEWSLETTER FOCUS */}
      {layout === "newsletter-focus" && <HeroNewsletter content={content} />}
        {layout === "single-image" && <HeroSingleImage content={content} />}

      {/* 7. APP SHOWCASE */}
      {layout === "app-showcase" && <HeroAppShowcase content={content} />}
    </div>
  );
}
