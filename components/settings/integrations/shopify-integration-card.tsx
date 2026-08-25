"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Loader2,
  Users,
  Package,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { IntegrationCard, IntegrationCardSkeleton } from "./integration-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CtaButton } from "@/components/ui/cta-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useGetShopifyConnection,
  useGetShopifySyncStatus,
  useConnectShopify,
  useDisconnectShopify,
  useSyncShopifyCustomers,
  useSyncShopifyOrders,
  useSyncShopifyProducts,
} from "@/graphql/actions";

export const ShopifyIntegrationCard = () => {
  const { data, loading, refetch } = useGetShopifyConnection();
  const { data: syncStatusData, refetch: refetchSyncStatus } =
    useGetShopifySyncStatus();
  const [connectShopify] = useConnectShopify();
  const [disconnectShopify] = useDisconnectShopify();

  const [syncCustomers] = useSyncShopifyCustomers();
  const [syncOrders] = useSyncShopifyOrders();
  const [syncProducts] = useSyncShopifyProducts();

  const [shopDomain, setShopDomain] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingState, setSyncingState] = useState<string | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const connection = data?.shopifyConnection;
  const isConnected = !!connection?.id;
  const syncStatus = syncStatusData?.shopifySyncStatus;

  const handleOpenConnectDialog = () => {
    setIsDialogOpen(true);
  };

  const cleanDomain = (input: string): string => {
    let cleaned = input.trim();
    // Remove protocol (http://, https://, hhtps://, etc.)
    cleaned = cleaned.replace(/^(?:https?|hhtps?):\/\//i, "");
    // Remove any leading slashes
    cleaned = cleaned.replace(/^\/+/, "");
    // Remove trailing slashes and any pathname/query/hash
    cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].trim();
    return cleaned;
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value.includes("://") ||
      value.startsWith("//") ||
      value.includes("/") ||
      value.startsWith("http") ||
      value.startsWith("hhtp")
    ) {
      setShopDomain(cleanDomain(value));
    } else {
      setShopDomain(value);
    }
  };

  const submitConnect = async () => {
    const cleaned = cleanDomain(shopDomain);
    if (!cleaned) {
      toast.error(
        "Please enter your Shopify store domain (e.g. mystore.myshopify.com)",
      );
      return;
    }

    setShopDomain(cleaned);
    setIsConnecting(true);
    try {
      const result = await connectShopify({ variables: { shopDomain: cleaned } });
      const authUrl = result.data?.connectShopify;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error("Failed to generate authorization URL.");
        setIsConnecting(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to Shopify");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectShopify();
      toast.success("Disconnected from Shopify");
      refetch();
      refetchSyncStatus();
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect");
    }
  };

  const handleSync = async (type: "customers" | "orders" | "products") => {
    setSyncingState(type);
    try {
      if (type === "customers") await syncCustomers();
      if (type === "orders") await syncOrders();
      if (type === "products") await syncProducts();

      toast.success(`Successfully synced ${type}!`);
      refetch();
      refetchSyncStatus();
    } catch (error: any) {
      toast.error(`Failed to sync ${type}`);
    } finally {
      setSyncingState(null);
    }
  };

  const renderSyncBadge = () => {
    if (isConnected && connection?.requiresReconnect) {
      return (
        <Badge
          variant="destructive"
          className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[9.5px] px-1.5 py-0"
        >
          Needs Reconnect
        </Badge>
      );
    }

    switch (syncStatus) {
      case "SYNCED_TODAY":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9.5px] px-1.5 py-0"
          >
            Synced Today
          </Badge>
        );
      case "SYNC_AVAILABLE":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[9.5px] px-1.5 py-0"
          >
            Sync Available
          </Badge>
        );
      case "NEVER_SYNCED":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[9.5px] px-1.5 py-0"
          >
            Never Synced
          </Badge>
        );
      case "UNAUTHORIZED":
        return (
          <Badge variant="destructive" className="text-[9.5px] px-1.5 py-0">
            Unauthorized
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[9.5px] px-1.5 py-0">
            Disconnected
          </Badge>
        );
    }
  };

  if (loading) {
    return <IntegrationCardSkeleton />;
  }

  return (
    <>
      <IntegrationCard
        title="Shopify"
        category="E-Commerce"
        description="Sync products, customers, and checkout orders from your online store directly with Thrico."
        icon={ShoppingBag}
        iconBgColor="bg-[#95BF47]"
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleOpenConnectDialog}
        onDisconnect={handleDisconnect}
      >
        <div className="space-y-3.5">
          {/* Store Info */}
          <div className="rounded-lg border border-border/40 bg-background/60 overflow-hidden divide-y divide-border/30">
            <div className="flex justify-between items-center px-3 py-2.5">
              <span className="text-[11px] text-muted-foreground font-medium">
                Store
              </span>
              <span className="text-[12px] font-medium text-foreground font-mono truncate max-w-[200px]">
                {connection?.shopDomain}
              </span>
            </div>
            <div className="flex justify-between items-center px-3 py-2.5">
              <span className="text-[11px] text-muted-foreground font-medium">
                Sync Status
              </span>
              {renderSyncBadge()}
            </div>
            <div className="flex justify-between items-center px-3 py-2.5">
              <span className="text-[11px] text-muted-foreground font-medium">
                Last Synced
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {connection?.lastSyncAt
                  ? new Date(connection.lastSyncAt).toLocaleString()
                  : "Never"}
              </span>
            </div>
          </div>

          {/* Manual Sync Controls */}
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground/70 tracking-wider">
              Manual Sync
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 px-2 font-medium rounded-lg border-border/50 hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
                onClick={() => handleSync("customers")}
                disabled={!!syncingState}
              >
                {syncingState === "customers" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <Users className="h-3 w-3 mr-1.5 opacity-60" />
                )}
                Customers
              </CtaButton>

              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 px-2 font-medium rounded-lg border-border/50 hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
                onClick={() => handleSync("products")}
                disabled={!!syncingState}
              >
                {syncingState === "products" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <Package className="h-3 w-3 mr-1.5 opacity-60" />
                )}
                Products
              </CtaButton>

              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 px-2 font-medium rounded-lg border-border/50 hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
                onClick={() => handleSync("orders")}
                disabled={!!syncingState}
              >
                {syncingState === "orders" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <ShoppingCart className="h-3 w-3 mr-1.5 opacity-60" />
                )}
                Orders
              </CtaButton>
            </div>
          </div>
        </div>
      </IntegrationCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl border-border/80">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-base font-semibold">Connect Shopify Store</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter your Shopify store domain to authorize Thrico to access your store's data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="shopDomain" className="text-xs font-medium">
                Store Domain
              </Label>
              <Input
                id="shopDomain"
                placeholder="e.g. mystore.myshopify.com"
                value={shopDomain}
                onChange={handleDomainChange}
                onPaste={(e) => {
                  e.preventDefault();
                  setShopDomain(cleanDomain(e.clipboardData.getData("text")));
                }}
                onBlur={() => setShopDomain((prev) => cleanDomain(prev))}
                className="w-full h-8 text-xs font-mono"
              />
            </div>
          </div>
          <DialogFooter className="mt-3 gap-2 sm:gap-0">
            <CtaButton
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsDialogOpen(false)}
              disabled={isConnecting}
            >
              Cancel
            </CtaButton>
            <CtaButton
              size="sm"
              className="h-8 text-xs"
              onClick={submitConnect}
              disabled={isConnecting || !shopDomain}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Store"
              )}
            </CtaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
