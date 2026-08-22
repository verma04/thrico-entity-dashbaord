"use client";

import React from "react";
import {
  Coins,
  ShoppingBag,
  Gift,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PillarsHeroProps {
  activePillar: "overview" | "manual" | "store" | "giftcards";
  onSelectPillar: (pillar: "overview" | "manual" | "store" | "giftcards") => void;
}

export const PillarsHero: React.FC<PillarsHeroProps> = ({
  activePillar,
  onSelectPillar,
}) => {
  const pillarCards = [
    {
      id: "manual",
      number: "Pillar 1",
      name: "Manual / Internal",
      tagline: "Vouchers, Coins & Passes",
      icon: Coins,
      cost: "Zero External Cost",
      funding: "Org Managed",
      badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60",
      activeRing: "ring-1.5 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
      iconBg: "bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      id: "store",
      number: "Pillar 2",
      name: "E-Commerce",
      tagline: "Shopify On-Win Discounts",
      icon: ShoppingBag,
      cost: "Dynamic API Synthesis",
      funding: "Merchant Funded",
      badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60",
      activeRing: "ring-1.5 ring-indigo-500 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20",
      iconBg: "bg-indigo-100/70 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
    },
    {
      id: "giftcards",
      number: "Pillar 3",
      name: "Digital Gift Cards",
      tagline: "Amazon, Flipkart & Brands",
      icon: Gift,
      cost: "Prepaid Wallet Budget",
      funding: "Prepaid + Fee",
      badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200/60",
      activeRing: "ring-1.5 ring-violet-500 border-violet-500 bg-violet-50/20 dark:bg-violet-950/20",
      iconBg: "bg-violet-100/70 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {pillarCards.map((card) => {
        const Icon = card.icon;
        const isActive = activePillar === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectPillar(card.id as any)}
            className={cn(
              "group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2.5 bg-card",
              isActive
                ? cn("shadow-sm", card.activeRing)
                : "border-border/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs",
            )}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", card.iconBg)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                      {card.number}
                    </span>
                    <h4 className="text-xs font-bold text-foreground leading-tight mt-0.5">
                      {card.name}
                    </h4>
                  </div>
                </div>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", card.badgeClass)}>
                  {card.funding}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-tight">
                {card.tagline}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-[10px]">
              <span className="font-medium text-muted-foreground">
                {card.cost}
              </span>
              <span className={cn("font-semibold flex items-center gap-0.5", isActive ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground")}>
                {isActive ? "Viewing" : "Configure"}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
