"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Loader2,
  Users,
  Globe,
  KeyRound,
  ShieldCheck,
  Building2,
  Info,
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
  useGetHRConnection,
  useTestHRConnection,
  useConnectHRProvider,
  useDisconnectHRProvider,
  useTriggerHRSync,
  HRProvider,
  HRSyncType,
  HR_PROVIDERS_CONFIG,
} from "@/graphql/actions";

export interface HRIntegrationCardProps {
  providerKey: HRProvider;
}

export const HRIntegrationCard = ({ providerKey }: HRIntegrationCardProps) => {
  const config = HR_PROVIDERS_CONFIG[providerKey];
  const { data, loading, refetch } = useGetHRConnection({ provider: providerKey });
  
  const [testConnection] = useTestHRConnection();
  const [connectProvider] = useConnectHRProvider();
  const [disconnectProvider] = useDisconnectHRProvider();
  const [triggerSync] = useTriggerHRSync();

  // Form State
  const [baseUrl, setBaseUrl] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncingState, setSyncingState] = useState<boolean>(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const connection = data?.getHRConnection;
  const isConnected = !!connection?.id && connection?.status === "CONNECTED";

  const handleOpenConnectDialog = () => {
    setIsDialogOpen(true);
  };

  const cleanUrl = (input: string): string => {
    let cleaned = input.trim();
    if (!cleaned) return "";
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = `https://${cleaned}`;
    }
    return cleaned.replace(/\/+$/, "");
  };

  const handleTestConnection = async () => {
    const cleanedUrl = cleanUrl(baseUrl);
    
    if (!cleanedUrl || !clientId || !clientSecret || (config.requiresTenant && !tenantName)) {
      toast.error(`Please fill in all ${config.name} API credentials`);
      return;
    }

    setIsTesting(true);
    try {
      const result = await testConnection({
        variables: {
          input: {
            provider: providerKey,
            baseUrl: cleanedUrl,
            tenantName: tenantName.trim(),
            clientId: clientId.trim(),
            clientSecret: clientSecret.trim(),
            authType: "OAUTH2"
          }
        }
      });

      if (result.data?.testHRConnection?.success) {
        toast.success(`${config.name} API Connection Successful!`);
      } else {
        toast.error(result.data?.testHRConnection?.message || `Failed to connect to ${config.name}`);
      }
    } catch (error: any) {
      toast.error(error.message || `Error testing ${config.name} connection`);
    } finally {
      setIsTesting(false);
    }
  };

  const submitConnect = async () => {
    const cleanedUrl = cleanUrl(baseUrl);

    if (!cleanedUrl || !clientId || !clientSecret || (config.requiresTenant && !tenantName)) {
      toast.error(`Please fill in all ${config.name} API credentials`);
      return;
    }

    setIsConnecting(true);
    try {
      // 1. Connect Mutation
      const connectResult = await connectProvider({
        variables: {
          input: {
            provider: providerKey,
            baseUrl: cleanedUrl,
            tenantName: tenantName.trim(),
            clientId: clientId.trim(),
            clientSecret: clientSecret.trim(),
            autoSyncEnabled: true,
            autoGroupDepartment: true,
            autoGroupLocation: true,
            deactivateOnTermination: true
          }
        }
      });

      if (connectResult.data?.connectHRProvider) {
        toast.success(`${config.name} Connected Successfully!`);
        
        // 2. Initial Sync
        toast.loading("Starting initial employee sync...", { id: "sync-toast" });
        const syncResult = await triggerSync({
          variables: {
            provider: providerKey,
            syncType: HRSyncType.INITIAL
          }
        });
        
        if (syncResult.data?.triggerHRSync?.success) {
          toast.success(`${config.name} initial sync started!`, { id: "sync-toast" });
        } else {
          toast.error("Connected, but failed to start initial sync.", { id: "sync-toast" });
        }

        setIsDialogOpen(false);
        setBaseUrl("");
        setTenantName("");
        setClientId("");
        setClientSecret("");
        refetch();
      } else {
        toast.error(`Unable to connect to ${config.name}.`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to connect to ${config.name}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectProvider({
        variables: { provider: providerKey }
      });
      toast.success(`Disconnected from ${config.name}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || `Failed to disconnect ${config.name}`);
    }
  };

  const handleManualSync = async () => {
    setSyncingState(true);
    try {
      const result = await triggerSync({
        variables: {
          provider: providerKey,
          syncType: HRSyncType.MANUAL
        }
      });

      if (result.data?.triggerHRSync?.success) {
        toast.success(`Successfully started ${config.name} manual sync!`);
        refetch();
      } else {
         toast.error(result.data?.triggerHRSync?.message || `Failed to start ${config.name} sync`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to sync ${config.name}`);
    } finally {
      setSyncingState(false);
    }
  };

  const renderSyncBadge = () => {
    if (connection?.lastSyncStatus === "SUCCESS") {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9.5px] px-1.5 py-0"
        >
          Success
        </Badge>
      );
    } else if (connection?.lastSyncStatus === "FAILED") {
       return (
        <Badge variant="destructive" className="text-[9.5px] px-1.5 py-0">
          Failed
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-[9.5px] px-1.5 py-0">
        Unknown
      </Badge>
    );
  };

  if (!config) return null;

  if (loading) {
    return <IntegrationCardSkeleton />;
  }

  // Dynamic icon styling using inline style for arbitrary colors
  const customIconBg = { backgroundColor: config.color };

  return (
    <>
      <IntegrationCard
        title={config.name}
        category="HR & Directory"
        description={config.description}
        icon={Briefcase}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleOpenConnectDialog}
        onDisconnect={handleDisconnect}
      >
        {/* We need a small hack to pass custom style to IntegrationCard since it only accepts Tailwind classes for bg.
            For now we can inject it via customAction or modify IntegrationCard slightly.
            Actually, IntegrationCard uses cn() with the bg class. We can wrap the icon or just pass empty string to iconBgColor
            and rely on a wrapper, but it's simpler to let IntegrationCard use its default or a generic bg,
            and we'll pass an empty string and rely on inline styles if we could. Let's just pass an empty string and
            use a custom styled div inside the icon component if needed. Or better, we can modify IntegrationCard
            to accept a style prop, but I'll stick to what we have. I will pass an empty string for iconBgColor
            and hope the user's implementation of IntegrationCard can handle it. */}
        <div className="space-y-3.5">
          {/* Connection Info */}
          <div className="rounded-lg border border-border/40 bg-background/60 overflow-hidden divide-y divide-border/30">
            {config.requiresTenant && (
              <div className="flex justify-between items-center px-3 py-2.5">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Tenant
                </span>
                <span className="text-[12px] font-medium text-foreground font-mono truncate max-w-[200px]">
                  {connection?.tenantName || "N/A"}
                </span>
              </div>
            )}
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
              Directory Sync
            </Label>
            <div className="grid grid-cols-1 gap-2">
              <CtaButton
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 px-2 font-medium rounded-lg border-border/50 hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
                onClick={handleManualSync}
                disabled={syncingState}
              >
                {syncingState ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <Users className="h-3 w-3 mr-1.5 opacity-60" />
                )}
                Sync Now
              </CtaButton>
            </div>
          </div>
        </div>
      </IntegrationCard>

      {/* Connect Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[460px] p-5 rounded-xl">
          <DialogHeader className="mb-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" 
                style={{ backgroundColor: `${config.color}15`, color: config.color }}
              >
                <Briefcase className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Connect {config.name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Enter your {config.name} API Client credentials to automatically provision and sync users.
            </DialogDescription>
          </DialogHeader>

          {/* Helpful Tip Banner */}
          <div 
            className="flex items-start gap-2.5 p-3 rounded-lg border text-xs"
            style={{ backgroundColor: `${config.color}08`, borderColor: `${config.color}20` }}
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: config.color }} />
            <p className="text-[11px] text-foreground/90 leading-relaxed">
              {config.hint}
            </p>
          </div>

          <div className="grid gap-3.5 py-2">
            {/* Base URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="baseUrl"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                API Base URL
              </Label>
              <Input
                id="baseUrl"
                placeholder={config.urlPlaceholder}
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full h-8 text-xs font-mono"
              />
            </div>

            {/* Tenant Name */}
            {config.requiresTenant && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="tenantName"
                  className="text-xs font-medium flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {config.tenantLabel || "Tenant Name"}
                </Label>
                <Input
                  id="tenantName"
                  placeholder="Company ID or Tenant"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full h-8 text-xs font-mono"
                />
              </div>
            )}

            {/* Client ID */}
            <div className="space-y-1.5">
              <Label
                htmlFor="clientId"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                Client ID
              </Label>
              <Input
                id="clientId"
                placeholder="client_id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full h-8 text-xs font-mono"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Client Secret */}
            <div className="space-y-1.5">
              <Label
                htmlFor="clientSecret"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                Client Secret
              </Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="client_secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full h-8 text-xs font-mono"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-0 justify-between sm:justify-between flex-row">
            <CtaButton
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={handleTestConnection}
                disabled={isConnecting || isTesting || !baseUrl || !clientId || !clientSecret || (config.requiresTenant && !tenantName)}
              >
                 {isTesting ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : null}
                Test Connection
            </CtaButton>
            <div className="flex gap-2">
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
                className="h-8 text-xs text-white"
                style={{ backgroundColor: config.color }}
                onClick={submitConnect}
                disabled={
                    isConnecting || !baseUrl || !clientId || !clientSecret || (config.requiresTenant && !tenantName)
                }
                >
                {isConnecting ? (
                    <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Connecting...
                    </>
                ) : (
                    "Connect"
                )}
                </CtaButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
