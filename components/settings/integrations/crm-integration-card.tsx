"use client";

import React, { useState } from "react";
import {
  Contact2,
  Loader2,
  Users,
  Globe,
  KeyRound,
  ShieldCheck,
  Building2,
  Database,
  User,
  Info,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { IntegrationCard, IntegrationCardSkeleton } from "./integration-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CtaButton } from "@/components/ui/cta-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  useGetCRMConnection,
  useTestCRMConnection,
  useConnectCRMProvider,
  useDisconnectCRMProvider,
  useTriggerCRMSync,
  CRMProvider,
  CRMAuthType,
  CRMSyncType,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";

export interface CRMIntegrationCardProps {
  providerKey: CRMProvider;
}

export const CRMIntegrationCard = ({ providerKey }: CRMIntegrationCardProps) => {
  const config = CRM_PROVIDERS_CONFIG[providerKey];
  const { data, loading, refetch } = useGetCRMConnection({ provider: providerKey });

  const [testConnection] = useTestCRMConnection();
  const [connectProvider] = useConnectCRMProvider();
  const [disconnectProvider] = useDisconnectCRMProvider();
  const [triggerSync] = useTriggerCRMSync();

  // Form State
  const [authType, setAuthType] = useState<CRMAuthType>(
    config?.defaultAuthType || CRMAuthType.OAUTH2
  );
  const [baseUrl, setBaseUrl] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [deactivateOnDelete, setDeactivateOnDelete] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncingState, setSyncingState] = useState<boolean>(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const connection = data?.getCRMConnection;
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

    if (!cleanedUrl) {
      toast.error(`Please provide the ${config.name} Base URL / Domain`);
      return;
    }

    if (config.requiresDatabase && !databaseName.trim()) {
      toast.error(`Please specify the database name for ${config.name}`);
      return;
    }

    setIsTesting(true);
    try {
      const result = await testConnection({
        variables: {
          input: {
            provider: providerKey,
            baseUrl: cleanedUrl,
            tenantName: tenantName.trim() || undefined,
            databaseName: databaseName.trim() || undefined,
            authType,
            clientId: clientId.trim() || undefined,
            clientSecret: clientSecret.trim() || undefined,
            apiKey: apiKey.trim() || undefined,
            username: username.trim() || undefined,
            accessKey: accessKey.trim() || undefined,
          },
        },
      });

      if (result.data?.testCRMConnection?.success) {
        toast.success(`${config.name} connection test passed successfully!`);
      } else {
        toast.error(
          result.data?.testCRMConnection?.message ||
            `Failed to verify credentials with ${config.name}`
        );
      }
    } catch (error: any) {
      toast.error(error.message || `Error testing ${config.name} connection`);
    } finally {
      setIsTesting(false);
    }
  };

  const submitConnect = async () => {
    const cleanedUrl = cleanUrl(baseUrl);

    if (!cleanedUrl) {
      toast.error(`Please provide the ${config.name} Base URL`);
      return;
    }

    setIsConnecting(true);
    try {
      const connectResult = await connectProvider({
        variables: {
          input: {
            provider: providerKey,
            baseUrl: cleanedUrl,
            tenantName: tenantName.trim() || undefined,
            databaseName: databaseName.trim() || undefined,
            authType,
            clientId: clientId.trim() || undefined,
            clientSecret: clientSecret.trim() || undefined,
            apiKey: apiKey.trim() || undefined,
            username: username.trim() || undefined,
            accessKey: accessKey.trim() || undefined,
            autoSyncEnabled,
            deactivateOnDelete,
          },
        },
      });

      const res = connectResult.data?.connectCRMProvider;
      if (res?.success) {
        if (res.authUrl) {
          toast.info("Redirecting to OAuth authorization...");
          window.location.href = res.authUrl;
          return;
        }

        toast.success(`${config.name} Connected Successfully!`);

        // Trigger initial sync
        toast.loading(`Starting initial ${config.name} sync...`, {
          id: "crm-sync-toast",
        });
        const syncResult = await triggerSync({
          variables: {
            provider: providerKey,
            syncType: CRMSyncType.INITIAL,
            async: true,
          },
        });

        if (syncResult.data?.triggerCRMSync?.success) {
          toast.success(`${config.name} initial sync queued!`, {
            id: "crm-sync-toast",
          });
        } else {
          toast.error("Connected, but failed to start initial sync.", {
            id: "crm-sync-toast",
          });
        }

        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        toast.error(res?.message || `Unable to connect to ${config.name}.`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to connect to ${config.name}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const resetForm = () => {
    setBaseUrl("");
    setTenantName("");
    setDatabaseName("");
    setClientId("");
    setClientSecret("");
    setApiKey("");
    setUsername("");
    setAccessKey("");
  };

  const handleDisconnect = async () => {
    try {
      await disconnectProvider({
        variables: { provider: providerKey },
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
          syncType: CRMSyncType.MANUAL,
          async: true,
        },
      });

      if (result.data?.triggerCRMSync?.success) {
        toast.success(`Started ${config.name} manual synchronization!`);
        refetch();
      } else {
        toast.error(
          result.data?.triggerCRMSync?.message ||
            `Failed to start ${config.name} sync`
        );
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
    } else if (connection?.lastSyncStatus === "IN_PROGRESS") {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[9.5px] px-1.5 py-0 animate-pulse"
        >
          Syncing
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-[9.5px] px-1.5 py-0">
        Ready
      </Badge>
    );
  };

  if (!config) return null;

  if (loading) {
    return <IntegrationCardSkeleton />;
  }

  const customIconBg = { backgroundColor: config.color };

  return (
    <>
      <IntegrationCard
        title={config.name}
        category="CRM & Pipeline"
        description={config.description}
        icon={Contact2}
        iconColor="text-white"
        iconBgColor="bg-slate-900"
        docsUrl={config.docsUrl}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleOpenConnectDialog}
        onDisconnect={handleDisconnect}
      >
        <div className="space-y-3.5">
          {/* Connection Details */}
          <div className="rounded-lg border border-border/40 bg-background/60 overflow-hidden divide-y divide-border/30">
            <div className="flex justify-between items-center px-3 py-2.5">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> Host / Instance
              </span>
              <span className="text-[12px] font-medium text-foreground font-mono truncate max-w-[200px]">
                {connection?.baseUrl || "Connected"}
              </span>
            </div>
            {connection?.databaseName && (
              <div className="flex justify-between items-center px-3 py-2.5">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                  <Database className="h-3 w-3" /> Database
                </span>
                <span className="text-[12px] font-medium text-foreground font-mono">
                  {connection.databaseName}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center px-3 py-2.5">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3" /> Sync Health
              </span>
              <div>{renderSyncBadge()}</div>
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

          {/* Sync Trigger Action */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-muted-foreground">
              Manual Trigger
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 px-3 rounded-md cursor-pointer"
              onClick={handleManualSync}
              disabled={syncingState}
            >
              <RefreshCw
                className={`h-3 w-3 ${syncingState ? "animate-spin" : ""}`}
              />
              {syncingState ? "Syncing..." : "Sync CRM"}
            </Button>
          </div>
        </div>
      </IntegrationCard>

      {/* Connect / Credentials Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                style={customIconBg}
              >
                <Contact2 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle>Connect {config.name}</DialogTitle>
                <DialogDescription className="text-xs">
                  Provide your API credentials to synchronize CRM contacts, leads, and custom entities.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Supported Auth Type Selector if multiple */}
            {config.supportedAuthTypes.length > 1 && (
              <div className="space-y-1.5">
                <Label className="text-xs">Authentication Method</Label>
                <div className="flex gap-2">
                  {config.supportedAuthTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAuthType(type)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        authType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-border/80"
                      }`}
                    >
                      {type === CRMAuthType.OAUTH2
                        ? "OAuth 2.0"
                        : type === CRMAuthType.API_KEY
                        ? "API Key"
                        : "REST Credentials"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Base / Instance URL */}
            <div className="space-y-1.5">
              <Label htmlFor="crm-base-url" className="text-xs flex items-center justify-between">
                <span>Instance URL / Domain</span>
                <span className="text-[10px] text-muted-foreground">Required</span>
              </Label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="crm-base-url"
                  placeholder={config.urlPlaceholder}
                  className="pl-8 text-xs h-9"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Database Name (for Odoo) */}
            {config.requiresDatabase && (
              <div className="space-y-1.5">
                <Label htmlFor="crm-db" className="text-xs flex items-center justify-between">
                  <span>{config.databaseLabel || "Database Name"}</span>
                  <span className="text-[10px] text-muted-foreground">Required</span>
                </Label>
                <div className="relative">
                  <Database className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="crm-db"
                    placeholder="e.g. production_db"
                    className="pl-8 text-xs h-9"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* OAuth Client ID & Secret */}
            {authType === CRMAuthType.OAUTH2 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="crm-client-id" className="text-xs flex items-center justify-between">
                    <span>Client ID / App Key</span>
                    <span className="text-[10px] text-muted-foreground">Required</span>
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="crm-client-id"
                      placeholder="e.g. 1000.XXXXX"
                      className="pl-8 text-xs h-9"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-client-secret" className="text-xs flex items-center justify-between">
                    <span>Client Secret</span>
                    <span className="text-[10px] text-muted-foreground">Required</span>
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="crm-client-secret"
                      type="password"
                      placeholder="••••••••••••••••"
                      className="pl-8 text-xs h-9"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* API Key */}
            {authType === CRMAuthType.API_KEY && (
              <div className="space-y-1.5">
                <Label htmlFor="crm-api-key" className="text-xs flex items-center justify-between">
                  <span>API Key / Access Token</span>
                  <span className="text-[10px] text-muted-foreground">Required</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="crm-api-key"
                    type="password"
                    placeholder="Enter API Key"
                    className="pl-8 text-xs h-9"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* REST Credentials (Username + AccessKey / Password) */}
            {authType === CRMAuthType.REST_CREDENTIALS && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="crm-username" className="text-xs flex items-center justify-between">
                    <span>Username / Email</span>
                    <span className="text-[10px] text-muted-foreground">Required</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="crm-username"
                      placeholder="admin@example.com"
                      className="pl-8 text-xs h-9"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-accesskey" className="text-xs flex items-center justify-between">
                    <span>Access Key / Password</span>
                    <span className="text-[10px] text-muted-foreground">Required</span>
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="crm-accesskey"
                      type="password"
                      placeholder="Enter Access Key or Password"
                      className="pl-8 text-xs h-9"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Sync Settings Switches */}
            <div className="p-3 bg-muted/40 rounded-lg space-y-2.5 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-xs">Automated Real-time Sync</p>
                  <p className="text-[10px] text-muted-foreground">Keep members and CRM contacts synchronized automatically.</p>
                </div>
                <Switch
                  checked={autoSyncEnabled}
                  onCheckedChange={setAutoSyncEnabled}
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/30">
                <div>
                  <p className="font-medium text-foreground text-xs">Deactivate on Delete</p>
                  <p className="text-[10px] text-muted-foreground">Archive member if deleted in CRM provider.</p>
                </div>
                <Switch
                  checked={deactivateOnDelete}
                  onCheckedChange={setDeactivateOnDelete}
                />
              </div>
            </div>

            {/* Hint alert & Documentation Link */}
            <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{config.hint}</span>
              </div>
              {config.docsUrl && (
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-semibold underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 ml-2"
                >
                  Setup Guide &rarr;
                </a>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={handleTestConnection}
              disabled={isTesting || isConnecting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
            <CtaButton
              type="button"
              size="sm"
              className="text-xs h-9"
              onClick={submitConnect}
              disabled={isConnecting || isTesting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Integration"
              )}
            </CtaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
