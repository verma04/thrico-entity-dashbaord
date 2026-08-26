"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, HelpCircle, ShoppingBag, CheckCircle2, AlertCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { GET_SHOPIFY_CONNECTION } from "@/graphql/actions/settings/shopify";

interface StoreBannerProps {
  onCreateClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const StoreBanner: React.FC<StoreBannerProps> = ({
  onCreateClick,
  onHowItWorksClick,
}) => {
  const { data: connectionData, loading: connectionLoading } = useQuery(
    GET_SHOPIFY_CONNECTION,
    { fetchPolicy: "cache-and-network" }
  );

  const shopifyConn = connectionData?.shopifyConnection;
  const isConnected = shopifyConn?.status === "CONNECTED" || !!shopifyConn?.shopDomain;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 2 • Shopify
            </Badge>
            {connectionLoading ? (
              <span className="text-[11px] text-muted-foreground animate-pulse">
                Checking store connection...
              </span>
            ) : isConnected ? (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Connected: {shopifyConn?.shopDomain || "Shopify Store"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Store Not Connected</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground">
            E-Commerce Store Discounts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure dynamic on-demand store discount rules. Codes are synthesized via Shopify PriceRules only when members actually win.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/integrations/shopify">
            <Button variant="outline" className="text-xs font-medium h-8 gap-1 shadow-2xs">
              <Link2 className="h-3 w-3" />
              Shopify Integration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
