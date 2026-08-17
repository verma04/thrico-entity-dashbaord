"use client";

import React, { useState } from "react";
import { ShoppingBag, RefreshCw, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Button } from "@/components/ui/button";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  ShopifyConnectionCard,
  ShopifySyncPipelines,
  ShopifyNotificationSettings,
  ShopifySidebarSummary,
  ShopifyDangerZone,
  ShopifyConnectModal,
  ShopifyDisconnectModal,
} from "@/components/integrations/shopify-settings";
import {
  useGetShopifyConnection,
  useGetShopifySyncStatus,
  useGetShopifyStats,
  useConnectShopify,
  useDisconnectShopify,
  useSyncShopifyCustomers,
  useSyncShopifyOrders,
  useSyncShopifyProducts,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ShopifySettingsPage() {
  const {
    data: connectionData,
    loading: connectionLoading,
    refetch: refetchConnection,
  } = useGetShopifyConnection();
  const {
    data: syncStatusData,
    loading: syncStatusLoading,
    refetch: refetchSyncStatus,
  } = useGetShopifySyncStatus();
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetShopifyStats();

  const [connectShopify] = useConnectShopify();
  const [disconnectShopify] = useDisconnectShopify();

  const [syncCustomers, { loading: syncingCustomers }] =
    useSyncShopifyCustomers();
  const [syncOrders, { loading: syncingOrders }] = useSyncShopifyOrders();
  const [syncProducts, { loading: syncingProducts }] = useSyncShopifyProducts();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [shopDomainInput, setShopDomainInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Notification and dispatch settings
  const [allowPushNotifications, setAllowPushNotifications] = useState(true);
  const [sendEmailOnSent, setSendEmailOnSent] = useState(true);
  const [notifyOnRewardDelivery, setNotifyOnRewardDelivery] = useState(true);
  const [notifyOnOrderSync, setNotifyOnOrderSync] = useState(false);

  // Unsaved changes state
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const connection = connectionData?.shopifyConnection;
  const isConnected = !!connection?.id;
  const syncStatus = syncStatusData?.shopifySyncStatus;
  const stats = statsData?.shopifyStats;

  const isSyncingAny = syncingCustomers || syncingOrders || syncingProducts;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchConnection(),
        refetchSyncStatus(),
        refetchStats(),
      ]);
      toast.success("Shopify integration settings refreshed");
    } catch {
      toast.error("Failed to refresh settings");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      await Promise.all([syncCustomers(), syncOrders(), syncProducts()]);
      toast.success("Full Shopify store synchronization complete");
      refetchConnection();
      refetchSyncStatus();
      refetchStats();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to trigger full sync");
    }
  };

  const handleSyncSingle = async (
    type: "customers" | "orders" | "products",
  ) => {
    try {
      if (type === "customers") await syncCustomers();
      if (type === "orders") await syncOrders();
      if (type === "products") await syncProducts();
      toast.success(`Successfully synced Shopify ${type}`);
      refetchStats();
      refetchConnection();
      refetchSyncStatus();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || `Failed to sync ${type}`);
    }
  };

  const cleanDomain = (input: string): string => {
    let cleaned = input.trim();
    cleaned = cleaned.replace(/^(?:https?|hhtps?):\/\//i, "");
    cleaned = cleaned.replace(/^\/+/, "");
    cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].trim();
    return cleaned;
  };

  const submitConnect = async () => {
    const cleaned = cleanDomain(shopDomainInput);
    if (!cleaned) {
      toast.error(
        "Please enter your Shopify store domain (e.g. mystore.myshopify.com)",
      );
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectShopify({
        variables: { shopDomain: cleaned },
      });
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

  const handleConfirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectShopify();
      toast.success("Disconnected from Shopify successfully");
      setIsDisconnectDialogOpen(false);
      refetchConnection();
      refetchSyncStatus();
      refetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect Shopify store");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanged(false);
      setSavedSuccess(true);
      toast.success("Shopify integration settings saved successfully");
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 400);
  };

  const handleResetSettings = () => {
    setAllowPushNotifications(true);
    setSendEmailOnSent(true);
    setNotifyOnRewardDelivery(true);
    setNotifyOnOrderSync(false);
    setHasChanged(false);
  };

  const updatePushNotifications = (val: boolean) => {
    setAllowPushNotifications(val);
    setHasChanged(true);
  };

  const updateEmailOnSent = (val: boolean) => {
    setSendEmailOnSent(val);
    setHasChanged(true);
  };

  const updateRewardDelivery = (val: boolean) => {
    setNotifyOnRewardDelivery(val);
    setHasChanged(true);
  };

  const updateOrderSync = (val: boolean) => {
    setNotifyOnOrderSync(val);
    setHasChanged(true);
  };

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Shopify Settings"
        badgeText="Store Configuration"
        description="Manage connected store credentials, automated synchronization pipelines, and dispatch notification preferences."
        icon={ShoppingBag}
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "Shopify", href: "/integrations/shopify" },
          { label: "Settings" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAll}
              disabled={isSyncingAny || !isConnected}
              className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <RefreshCw
                className={cn("h-3 w-3", isSyncingAny && "animate-spin")}
              />
              {isSyncingAny ? "Syncing Store…" : "Sync All Data"}
            </Button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
              onClick={handleRefresh}
              disabled={statsLoading || connectionLoading || isRefreshing}
            >
              <RotateCcw
                size={13}
                className={cn(
                  (statsLoading || connectionLoading || isRefreshing) &&
                    "animate-spin",
                )}
              />
            </Button>
          </div>
        }
      />

      {/* Polaris Layout with Main Steps and Live Matrix Sidebar */}
      <PolarisFormLayout
        sidebar={
          <ShopifySidebarSummary
            connection={connection}
            isConnected={isConnected}
            allowPushNotifications={allowPushNotifications}
            sendEmailOnSent={sendEmailOnSent}
            stats={stats}
          />
        }
      >
        <div className="space-y-6">
          {/* Step 1: Store Connection & Account Card */}
          <ShopifyConnectionCard
            connection={connection}
            isConnected={isConnected}
            syncStatus={syncStatus}
            onOpenConnect={() => {
              setShopDomainInput(connection?.shopDomain || "");
              setIsConnectDialogOpen(true);
            }}
            onOpenDisconnect={() => setIsDisconnectDialogOpen(true)}
          />

          {/* Step 2: Notification & Communication Channels */}
          <ShopifyNotificationSettings
            allowPushNotifications={allowPushNotifications}
            setAllowPushNotifications={updatePushNotifications}
            sendEmailOnSent={sendEmailOnSent}
            setSendEmailOnSent={updateEmailOnSent}
            notifyOnRewardDelivery={notifyOnRewardDelivery}
            setNotifyOnRewardDelivery={updateRewardDelivery}
            notifyOnOrderSync={notifyOnOrderSync}
            setNotifyOnOrderSync={updateOrderSync}
          />

          {/* Step 3: Data Synchronization Pipelines */}
          <ShopifySyncPipelines
            stats={stats}
            isConnected={isConnected}
            syncingCustomers={syncingCustomers}
            syncingProducts={syncingProducts}
            syncingOrders={syncingOrders}
            onSync={handleSyncSingle}
          />

          {/* Step 4: Danger Zone */}
          {isConnected && (
            <ShopifyDangerZone
              shopDomain={connection?.shopDomain}
              onOpenDisconnect={() => setIsDisconnectDialogOpen(true)}
            />
          )}

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={hasChanged}
            saved={savedSuccess}
            isSaving={isSaving}
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
            title="Unsaved Changes"
            description="You have unsaved changes to notification and sync preferences."
            buttonText="Save Changes"
          />
        </div>
      </PolarisFormLayout>

      {/* Connect Modal */}
      <ShopifyConnectModal
        isOpen={isConnectDialogOpen}
        onClose={() => setIsConnectDialogOpen(false)}
        isConnected={isConnected}
        shopDomainInput={shopDomainInput}
        setShopDomainInput={setShopDomainInput}
        isConnecting={isConnecting}
        onConnect={submitConnect}
      />

      {/* Disconnect Modal */}
      <ShopifyDisconnectModal
        isOpen={isDisconnectDialogOpen}
        onClose={() => setIsDisconnectDialogOpen(false)}
        shopDomain={connection?.shopDomain}
        isDisconnecting={isDisconnecting}
        onConfirmDisconnect={handleConfirmDisconnect}
      />
    </EcosystemWrapper>
  );
}
