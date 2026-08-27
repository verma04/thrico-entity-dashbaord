"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Loader2,
  Users,
  Package,
  ShoppingCart,
  Store,
  KeyRound,
  Globe,
  Info,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
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
  useGetWooCommerceConnection,
  useGetWooCommerceSyncStatus,
  useConnectWooCommerce,
  useDisconnectWooCommerce,
  useSyncWooCommerceCustomers,
  useSyncWooCommerceOrders,
  useSyncWooCommerceProducts,
} from "@/graphql/actions";

// Custom WooCommerce Icon Component with WooCommerce brand colors
export const WooCommerceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M2.5 5.5C2.5 4.39543 3.39543 3.5 4.5 3.5H19.5C20.6046 3.5 21.5 4.39543 21.5 5.5V14.5C21.5 15.6046 20.6046 16.5 19.5 16.5H16.8L14.2 19.5C13.8 20 13.1 20.3 12.4 20.3C11.7 20.3 11 20 10.6 19.5L8 16.5H4.5C3.39543 16.5 2.5 15.6046 2.5 14.5V5.5ZM6.5 8.5C6.5 9.8 7.4 10.8 8.5 11.2C8.8 9.5 9.8 8.1 11.2 7.5C10.5 7 9.5 6.7 8.5 6.7C7.4 6.7 6.5 7.5 6.5 8.5ZM13.8 11.2C14.9 10.8 15.8 9.8 15.8 8.5C15.8 7.5 14.9 6.7 13.8 6.7C12.8 6.7 11.8 7 11.1 7.5C12.5 8.1 13.5 9.5 13.8 11.2Z" />
  </svg>
);

export const WooCommerceIntegrationCard = () => {
  const { data, loading, refetch } = useGetWooCommerceConnection();
  const { data: syncStatusData, refetch: refetchSyncStatus } =
    useGetWooCommerceSyncStatus();
  const [connectWooCommerce] = useConnectWooCommerce();
  const [disconnectWooCommerce] = useDisconnectWooCommerce();

  const [syncCustomers] = useSyncWooCommerceCustomers();
  const [syncOrders] = useSyncWooCommerceOrders();
  const [syncProducts] = useSyncWooCommerceProducts();

  // Form State
  const [siteUrl, setSiteUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingState, setSyncingState] = useState<string | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const connection = data?.wooCommerceConnection;
  const isConnected = !!connection?.id;
  const syncStatus = syncStatusData?.wooCommerceSyncStatus;

  const handleOpenConnectDialog = () => {
    setIsDialogOpen(true);
  };

  const cleanUrl = (input: string): string => {
    let cleaned = input.trim();
    if (!cleaned) return "";
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = `https://${cleaned}`;
    }
    // Remove trailing slash
    return cleaned.replace(/\/+$/, "");
  };

  const submitConnect = async () => {
    const cleanedUrl = cleanUrl(siteUrl);
    const cleanedKey = consumerKey.trim();
    const cleanedSecret = consumerSecret.trim();

    if (!cleanedUrl) {
      toast.error(
        "Please enter your WooCommerce store URL (e.g. https://mystore.com)",
      );
      return;
    }
    if (!cleanedKey) {
      toast.error("Please enter your WooCommerce Consumer Key (e.g. ck_...)");
      return;
    }
    if (!cleanedSecret) {
      toast.error(
        "Please enter your WooCommerce Consumer Secret (e.g. cs_...)",
      );
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectWooCommerce({
        variables: {
          siteUrl: cleanedUrl,
          consumerKey: cleanedKey,
          consumerSecret: cleanedSecret,
        },
      });

      if (result.data?.connectWooCommerce) {
        toast.success("WooCommerce Store Connected Successfully!");
        setIsDialogOpen(false);
        setSiteUrl("");
        setConsumerKey("");
        setConsumerSecret("");
        refetch();
        refetchSyncStatus();
      } else {
        toast.error(
          "Unable to connect to WooCommerce store. Please verify your credentials.",
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to WooCommerce store");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWooCommerce();
      toast.success("Disconnected from WooCommerce");
      refetch();
      refetchSyncStatus();
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect WooCommerce");
    }
  };

  const handleSync = async (type: "customers" | "orders" | "products") => {
    setSyncingState(type);
    try {
      if (type === "customers") await syncCustomers();
      if (type === "orders") await syncOrders();
      if (type === "products") await syncProducts();

      toast.success(`Successfully synced WooCommerce ${type}!`);
      refetch();
      refetchSyncStatus();
    } catch (error: any) {
      toast.error(error.message || `Failed to sync WooCommerce ${type}`);
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
        title="WooCommerce"
        category="E-Commerce"
        description="Sync products, customers, and checkout orders from your WordPress WooCommerce store directly with Thrico."
        icon={Store}
        iconBgColor="bg-[#7F54B3]"
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
                {connection?.siteUrl}
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

          {/* Quick Dashboard Jump */}
          <div className="pt-0.5">
            <Link href="/integrations/woocommerce" className="block w-full">
              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11.5px] h-8 px-2.5 font-semibold rounded-lg border-border/60 hover:bg-muted/70 gap-1.5 justify-center transition-colors cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#7F54B3]" />
                Open WooCommerce Dashboard
                <ArrowRight className="h-3 w-3 ml-auto opacity-50" />
              </CtaButton>
            </Link>
          </div>
        </div>
      </IntegrationCard>

      {/* Connect WooCommerce Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[460px] p-5 rounded-xl">
          <DialogHeader className="mb-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-8 w-8 rounded-lg bg-[#7F54B3]/10 text-[#7F54B3] flex items-center justify-center shrink-0">
                <Store className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Connect WooCommerce Store
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Enter your WordPress WooCommerce REST API credentials to establish
              a secure real-time data connection.
            </DialogDescription>
          </DialogHeader>

          {/* Helpful Tip Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#7F54B3]/10 border border-[#7F54B3]/20 text-xs">
            <Info className="h-4 w-4 text-[#7F54B3] shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground/90 leading-relaxed">
              In your WordPress Admin, go to{" "}
              <strong className="font-semibold text-foreground">
                WooCommerce → Settings → Advanced → REST API → Add Key
              </strong>{" "}
              with <span className="font-semibold underline">Read/Write</span>{" "}
              permissions.
            </p>
          </div>

          <div className="grid gap-3.5 py-2">
            {/* Store URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="siteUrl"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Store URL
              </Label>
              <Input
                id="siteUrl"
                placeholder="https://mystore.com"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full h-8 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                The full URL of your WordPress WooCommerce website.
              </p>
            </div>

            {/* Consumer Key */}
            <div className="space-y-1.5">
              <Label
                htmlFor="consumerKey"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                Consumer Key
              </Label>
              <Input
                id="consumerKey"
                placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={consumerKey}
                onChange={(e) => setConsumerKey(e.target.value)}
                className="w-full h-8 text-xs font-mono"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Consumer Secret */}
            <div className="space-y-1.5">
              <Label
                htmlFor="consumerSecret"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                Consumer Secret
              </Label>
              <Input
                id="consumerSecret"
                type="password"
                placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={consumerSecret}
                onChange={(e) => setConsumerSecret(e.target.value)}
                className="w-full h-8 text-xs font-mono"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-0">
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
              className="h-8 text-xs bg-[#7F54B3] hover:bg-[#6e469e] text-white"
              onClick={submitConnect}
              disabled={
                isConnecting || !siteUrl || !consumerKey || !consumerSecret
              }
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Verifying & Connecting...
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
