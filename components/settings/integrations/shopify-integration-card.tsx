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
  const { data: syncStatusData, refetch: refetchSyncStatus } = useGetShopifySyncStatus();
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

  const submitConnect = async () => {
    if (!shopDomain) {
      toast.error(
        "Please enter your Shopify store domain (e.g. mystore.myshopify.com)",
      );
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectShopify({ variables: { shopDomain } });
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
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">Synced Today</Badge>;
      case "SYNC_AVAILABLE":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]">Sync Available</Badge>;
      case "NEVER_SYNCED":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">Never Synced</Badge>;
      case "UNAUTHORIZED":
        return <Badge variant="destructive" className="text-[10px]">Unauthorized</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">Disconnected</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-card rounded-xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <IntegrationCard
        title="Shopify"
        description="E-commerce & Retail"
        icon={ShoppingBag}
        iconBgColor="bg-[#95BF47]"
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleOpenConnectDialog}
        onDisconnect={handleDisconnect}
      >
        <div className="pt-2 border-t space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            <div className="flex flex-col gap-1 p-2 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Connected Store
                </span>
                <span className="text-xs font-medium">
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
                <span className="text-xs font-medium">
                  {connection?.lastSyncAt
                    ? new Date(connection.lastSyncAt).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                Manual Sync
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <CtaButton
                  variant="outline"
                  className="w-full text-[10px]"
                  onClick={() => handleSync("customers")}
                  disabled={!!syncingState}
                >
                  {syncingState === "customers" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Users className="h-3 w-3 mr-1" />
                  )}
                  Customers
                </CtaButton>

                <CtaButton
                  variant="outline"
                  className="w-full text-[10px]"
                  onClick={() => handleSync("products")}
                  disabled={!!syncingState}
                >
                  {syncingState === "products" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Package className="h-3 w-3 mr-1" />
                  )}
                  Products
                </CtaButton>

                <CtaButton
                  variant="outline"
                  className="w-full text-[10px]"
                  onClick={() => handleSync("orders")}
                  disabled={!!syncingState}
                >
                  {syncingState === "orders" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <ShoppingCart className="h-3 w-3 mr-1" />
                  )}
                  Orders
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </IntegrationCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-5">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg">Connect Shopify Store</DialogTitle>
            <DialogDescription className="text-xs">
              Enter your Shopify store domain to authorize Thrico to access your
              store's data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="shopDomain" className="text-xs font-medium">
                Store Domain
              </Label>
              <Input
                id="shopDomain"
                placeholder="e.g. mystore.myshopify.com"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                className="w-full h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <CtaButton
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isConnecting}
            >
              Cancel
            </CtaButton>
            <CtaButton
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
