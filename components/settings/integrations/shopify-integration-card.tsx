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
import { IntegrationCard } from "./integration-card";
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
    switch (syncStatus) {
      case "SYNCED_TODAY":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            Synced Today
          </Badge>
        );
      case "SYNC_AVAILABLE":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]"
          >
            Sync Available
          </Badge>
        );
      case "NEVER_SYNCED":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]"
          >
            Never Synced
          </Badge>
        );
      case "UNAUTHORIZED":
        return (
          <Badge variant="destructive" className="text-[10px]">
            Unauthorized
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            Disconnected
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-card rounded-xl border border-border/60">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
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
        <div className="space-y-3">
          {/* Store Info Chips */}
          <div className="flex flex-col gap-1.5 p-2.5 bg-background/80 rounded-lg border border-border/50 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Connected Store
              </span>
              <span className="text-xs font-medium text-foreground font-mono">
                {connection?.shopDomain}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Sync Status
              </span>
              {renderSyncBadge()}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
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
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
              Manual Sync
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-7 px-2 font-medium"
                onClick={() => handleSync("customers")}
                disabled={!!syncingState}
              >
                {syncingState === "customers" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Users className="h-3 w-3 mr-1 opacity-70" />
                )}
                Customers
              </CtaButton>

              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-7 px-2 font-medium"
                onClick={() => handleSync("products")}
                disabled={!!syncingState}
              >
                {syncingState === "products" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Package className="h-3 w-3 mr-1 opacity-70" />
                )}
                Products
              </CtaButton>

              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-7 px-2 font-medium"
                onClick={() => handleSync("orders")}
                disabled={!!syncingState}
              >
                {syncingState === "orders" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <ShoppingCart className="h-3 w-3 mr-1 opacity-70" />
                )}
                Orders
              </CtaButton>
            </div>
          </div>
        </div>
      </IntegrationCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-5 rounded-xl">
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
