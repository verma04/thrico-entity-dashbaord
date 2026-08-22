"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Gift,
  CheckCircle2,
  Zap,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  onSelectPillar?: (pillarId: "manual" | "store" | "giftcards") => void;
  activePillar?: string;
}

export const PillarsComparisonTable: React.FC<ComparisonTableProps> = ({
  onSelectPillar,
  activePillar,
}) => {
  const pillars = [
    {
      id: "manual",
      number: "Pillar 1",
      name: "Manual / Internal",
      badge: "Zero Cost",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60",
      icon: Coins,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60",
      source: "Org-created rewards",
      fulfillment: "Promo codes, vouchers, coins, badges, tickets",
      funding: "Org-managed (No provider cost)",
      speed: "Instant / CSV",
      highlights: ["Static & batch vouchers", "TC & Entity coins", "Badges & event passes"],
      idealFor: "Community engagement & gamification burn loops",
    },
    {
      id: "store",
      number: "Pillar 2",
      name: "E-Commerce",
      badge: "Shopify Store",
      badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/60",
      icon: ShoppingBag,
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-950/60",
      source: "Connected Shopify Store",
      fulfillment: "Unique, on-demand store discounts",
      funding: "Merchant-funded",
      speed: "On-Win API",
      highlights: ["₹100, ₹500 fixed discounts", "10%, 20% order rules", "Free shipping codes"],
      idealFor: "Direct sales uplift & store conversions",
    },
    {
      id: "giftcards",
      number: "Pillar 3",
      name: "Digital Gift Cards",
      badge: "Top Brands",
      badgeColor: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200/60",
      icon: Gift,
      iconColor: "text-violet-600 dark:text-violet-400 bg-violet-100/60 dark:bg-violet-950/60",
      source: "Thrico Brand Catalog",
      fulfillment: "Digital cards to My Rewards Wallet",
      funding: "Prepaid budget + fee",
      speed: "Instant API",
      highlights: ["Amazon, Flipkart, Swiggy, Uber", "Prepaid budget controls", "Zero inventory risk"],
      idealFor: "High-value acquisition & member retention",
    },
  ];

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
      <div className="p-3.5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <h4 className="text-xs font-bold text-foreground">
            Architecture Comparison Matrix
          </h4>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">
          3 Foundational Fulfillment Mechanisms
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent text-[11px]">
              <TableHead className="w-[180px] font-bold text-foreground py-2 px-3 text-[11px]">
                Pillar
              </TableHead>
              <TableHead className="font-bold text-foreground py-2 px-3 text-[11px]">
                Source
              </TableHead>
              <TableHead className="font-bold text-foreground py-2 px-3 text-[11px]">
                Fulfillment
              </TableHead>
              <TableHead className="font-bold text-foreground py-2 px-3 text-[11px]">
                Funding
              </TableHead>
              <TableHead className="text-right font-bold text-foreground py-2 px-3 text-[11px]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === pillar.id;

              return (
                <TableRow
                  key={pillar.id}
                  className={cn(
                    "group transition-colors duration-100 cursor-pointer text-xs",
                    isSelected
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20"
                      : "hover:bg-muted/30",
                  )}
                  onClick={() => onSelectPillar?.(pillar.id as any)}
                >
                  {/* Pillar Title */}
                  <TableCell className="py-2.5 px-3 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-md flex items-center justify-center shrink-0",
                            pillar.iconColor,
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase text-muted-foreground block leading-none">
                            {pillar.number}
                          </span>
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {pillar.name}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border",
                          pillar.badgeColor,
                        )}
                      >
                        {pillar.badge}
                      </span>
                    </div>
                  </TableCell>

                  {/* Reward Source */}
                  <TableCell className="py-2.5 px-3 align-top">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-foreground">
                        {pillar.source}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-tight">
                        {pillar.idealFor}
                      </div>
                    </div>
                  </TableCell>

                  {/* Fulfillment */}
                  <TableCell className="py-2.5 px-3 align-top">
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-foreground">
                        {pillar.fulfillment}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pillar.highlights.slice(0, 2).map((hl, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[9px] bg-muted/50 text-muted-foreground px-1 py-0.2 rounded"
                          >
                            <CheckCircle2 className="h-2 w-2 text-emerald-500" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Funding */}
                  <TableCell className="py-2.5 px-3 align-top">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">
                        {pillar.funding}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Zap className="h-2.5 w-2.5 text-amber-500" />
                        <span>Delivery: {pillar.speed}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="py-2.5 px-3 text-right align-top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPillar?.(pillar.id as any);
                      }}
                      className={cn(
                        "inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-md transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted hover:bg-zinc-200 dark:hover:bg-zinc-800 text-foreground",
                      )}
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
