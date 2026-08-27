"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, HelpCircle, ShoppingBag, Store, CheckCircle2, AlertCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { GET_SHOPIFY_CONNECTION } from "@/graphql/actions/settings/shopify";
import { GET_WOOCOMMERCE_CONNECTION } from "@/graphql/actions/settings/woocommerce";

interface StoreBannerProps {
  onCreateClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const StoreBanner: React.FC<StoreBannerProps> = ({
  onCreateClick,
  onHowItWorksClick,
}) => {
  const { data: shopifyData, loading: shopifyLoading } = useQuery(
    GET_SHOPIFY_CONNECTION,
    { fetchPolicy: "cache-and-network" }
  );
  const { data: wooData, loading: wooLoading } = useQuery(
    GET_WOOCOMMERCE_CONNECTION,
    { fetchPolicy: "cache-and-network" }
  );

  const shopifyConn = shopifyData?.shopifyConnection;
  const isShopifyConnected = shopifyConn?.status === "CONNECTED" || !!shopifyConn?.shopDomain;

  const wooConn = wooData?.wooCommerceConnection;
  const isWooConnected = !!wooConn?.siteUrl;

  const anyConnected = isShopifyConnected || isWooConnected;
  const checking = shopifyLoading || wooLoading;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 2 • E-Commerce
            </Badge>
            {checking ? (
              <span className="text-[11px] text-muted-foreground animate-pulse">
                Checking store connections...
              </span>
            ) : anyConnected ? (
              <div className="flex items-center gap-2 flex-wrap">
                {isShopifyConnected && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Shopify: {shopifyConn?.shopDomain}</span>
                  </div>
                )}
                {isWooConnected && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7F54B3]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>WooCommerce: {wooConn?.siteUrl}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>No Store Connected</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground">
            E-Commerce Store Discounts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure dynamic on-demand store discount rules. Codes are synthesized via Shopify PriceRules and WooCommerce Coupons only when members actually win.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link href="/integrations/shopify">
            <Button variant="outline" className="text-xs font-medium h-8 gap-1 shadow-2xs">
              <ShoppingBag className="h-3 w-3 text-emerald-600" />
              Shopify
            </Button>
          </Link>
          <Link href="/integrations/woocommerce">
            <Button variant="outline" className="text-xs font-medium h-8 gap-1 shadow-2xs">
              <Store className="h-3 w-3 text-[#7F54B3]" />
              WooCommerce
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
