"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Activity,
  Phone,
  Layers,
  Sparkles,
  KeyRound,
  FlaskConical,
  Info,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { IntegrationCard, IntegrationCardSkeleton } from "./integration-card";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import {
  useGetWhatsAppConnections,
  useConnectWhatsAppEmbeddedSignup,
  useConnectWhatsAppDirect,
  useTestWhatsAppConnection,
  useSyncWhatsAppTemplates,
  useGetWhatsAppConfig,
  WhatsAppConnectionStatus,
  WhatsAppConnection,
} from "@/graphql/actions";

interface MetaFacebookSDK {
  init: (options: Record<string, unknown>) => void;
  login: (
    callback: (response: { authResponse?: { code?: string } }) => void,
    options?: Record<string, unknown>
  ) => void;
}

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: MetaFacebookSDK;
  }
}

export const WhatsAppIntegrationCard = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: configData } = useGetWhatsAppConfig();
  const metaAppId = configData?.getWhatsAppConfig?.appId;
  const metaConfigId = configData?.getWhatsAppConfig?.configId;
  const graphApiVersion =
    configData?.getWhatsAppConfig?.graphApiVersion || "v25.0";
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Direct Test Key / Sandbox Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [showTokenText, setShowTokenText] = useState(false);
  const [testFormData, setTestFormData] = useState({
    accessToken: "",
    phoneNumberId: "",
    wabaId: "",
    phoneNumber: "",
    verifiedName: "",
  });

  // Local optimistic connection details fallback
  const [optimisticConnection, setOptimisticConnection] =
    useState<WhatsAppConnection | null>(null);

  // 1. Query live connection status from GraphQL
  const {
    data: connectionsData,
    loading: isLoadingConnections,
    refetch: refetchConnections,
  } = useGetWhatsAppConnections();

  const [connectEmbeddedSignup] = useConnectWhatsAppEmbeddedSignup();
  const [connectDirectMutation, { loading: isConnectingDirect }] =
    useConnectWhatsAppDirect();
  const [testConnectionMutation] = useTestWhatsAppConnection();
  const [syncTemplatesMutation] = useSyncWhatsAppTemplates();

  // Find the active connected connection
  const activeConnection: WhatsAppConnection | null =
    optimisticConnection ||
    connectionsData?.getWhatsAppConnections?.find(
      (c) => c.status === WhatsAppConnectionStatus.CONNECTED && c.isDefault,
    ) ||
    connectionsData?.getWhatsAppConnections?.find(
      (c) => c.status === WhatsAppConnectionStatus.CONNECTED,
    ) ||
    null;

  const isConnected = !!activeConnection;

  // Ref to hold transient Meta Embedded Signup session asset IDs (<30s TTL)
  const sessionAssetsRef = useRef<{
    waba_id?: string;
    phone_number_id?: string;
    business_id?: string;
  } | null>(null);

  // Track whether FB.init() has been called with a valid appId
  const fbInitCalledRef = useRef(false);

  // 2. Initialize Meta JavaScript SDK & Window postMessage Listener
  useEffect(() => {
    // Don't attempt SDK init until we have a valid appId from the config query
    if (!metaAppId) return;

    const initFB = () => {
      if (fbInitCalledRef.current) return;
      window.FB?.init({
        appId: metaAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: graphApiVersion,
      });
      fbInitCalledRef.current = true;
    };

    // If the SDK script hasn't been injected yet, add it
    if (!document.getElementById("facebook-jssdk")) {
      window.fbAsyncInit = initFB;
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.FB) {
      initFB();
    } else {
      window.fbAsyncInit = initFB;
    }

    // Listen for Meta's WA_EMBEDDED_SIGNUP window postMessage events
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      let data: {
        type?: string;
        event?: string;
        data?: {
          waba_id?: string;
          phone_number_id?: string;
          business_id?: string;
          error_message?: string;
        };
      } | null = null;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (data?.type === "WA_EMBEDDED_SIGNUP") {
        const eventName = String(data.event || "").toUpperCase();

        if (data.data?.waba_id) {
          sessionAssetsRef.current = {
            waba_id: data.data.waba_id,
            phone_number_id: data.data.phone_number_id || undefined,
            business_id: data.data.business_id || undefined,
          };
        }

        if (
          eventName === "FINISH" ||
          eventName === "FINISH_ONLY_WABA" ||
          eventName === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"
        ) {
          toast.info("WhatsApp linked! Finalizing connection with server...");
        } else if (eventName === "CANCEL") {
          setIsConnecting(false);
          toast.warning("WhatsApp setup was cancelled.");
        } else if (eventName === "ERROR") {
          setIsConnecting(false);
          toast.error(
            data.data?.error_message ||
              "Meta Embedded Signup encountered an error",
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [metaAppId, graphApiVersion]);

  // 3. Fast-path Backend Handoff (< 30s TTL)
  const completeBackendOnboarding = async (authCode: string) => {
    try {
      const sessionInfo = sessionAssetsRef.current;
      const wabaId = sessionInfo?.waba_id;
      const phoneNumberId = sessionInfo?.phone_number_id;
      const businessId = sessionInfo?.business_id;

      // Primary: Apollo GraphQL Mutation
      try {
        const response = await connectEmbeddedSignup({
          variables: {
            input: {
              code: authCode,
              wabaId,
              phoneNumberId,
              businessId,
            },
          },
        });

        if (response.data?.connectWhatsAppEmbeddedSignup) {
          const conn = response.data.connectWhatsAppEmbeddedSignup;
          setOptimisticConnection(conn as unknown as WhatsAppConnection);
          await refetchConnections();
          toast.success("WhatsApp Business Account connected successfully!");
          return;
        }
      } catch (gqlErr: unknown) {
        console.warn(
          "GraphQL connect error, attempting REST fallback:",
          gqlErr,
        );
      }

      // Secondary: REST API Fallback
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1111";
      const token =
        typeof window !== "undefined" ? localStorage.getItem("key") : null;

      const res = await fetch(
        `${backendUrl}/api/whatsapp/complete-onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            code: authCode,
            waba_id: wabaId,
            phone_number_id: phoneNumberId,
            business_id: businessId,
          }),
        },
      );

      const result = await res.json().catch(() => ({}));
      if (!res.ok || result.error) {
        throw new Error(
          result.error || "Failed to complete onboarding on server",
        );
      }

      if (result.connection) {
        setOptimisticConnection(result.connection);
      }
      await refetchConnections();
      toast.success("WhatsApp Business Account connected successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to finalize WhatsApp connection";
      toast.error(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  // 4. Launch Meta Login for Business Popup (v4 with Coexistence)
  const handleConnect = () => {
    if (!window.FB || !fbInitCalledRef.current) {
      toast.error(
        "Meta SDK is still initializing. Please try again in a few seconds.",
      );
      return;
    }

    setIsConnecting(true);
    const configId = metaConfigId;

    window.FB.login(
      (response: { authResponse?: { code?: string } }) => {
        if (response.authResponse?.code) {
          completeBackendOnboarding(response.authResponse.code);
        } else {
          setIsConnecting(false);
          toast.warning("WhatsApp authorization cancelled or dismissed.");
        }
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "whatsapp_business_app_onboarding", // Coexistence mode
        },
      },
    );
  };

  // 5. Connect with Test Key / Sandbox Mode directly
  const handleConnectWithTestKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFormData.accessToken.trim()) {
      toast.error("Access Token is required (from Meta API Setup)");
      return;
    }
    if (!testFormData.phoneNumberId.trim()) {
      toast.error("Phone Number ID is required");
      return;
    }
    if (!testFormData.wabaId.trim()) {
      toast.error("WhatsApp Business Account ID (WABA ID) is required");
      return;
    }

    try {
      const res = await connectDirectMutation({
        variables: {
          input: {
            accessToken: testFormData.accessToken.trim(),
            phoneNumberId: testFormData.phoneNumberId.trim(),
            wabaId: testFormData.wabaId.trim(),
            phoneNumber: testFormData.phoneNumber.trim() || undefined,
            displayPhoneNumber: testFormData.phoneNumber.trim() || undefined,
            verifiedName:
              testFormData.verifiedName.trim() || "Meta Cloud Sandbox",
            environment: "SANDBOX",
            provider: "META_CLOUD_API",
            isDefault: true,
          },
        },
      });

      if (res.data?.connectWhatsApp) {
        setOptimisticConnection(res.data.connectWhatsApp);
        toast.success("Connected to WhatsApp Cloud API Sandbox successfully!");
        setIsTestModalOpen(false);
        await refetchConnections();
      }
    } catch (err: unknown) {
      console.error("Direct connection failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to connect with test key";
      toast.error(msg);
    }
  };

  // 6. Test Live Connection Diagnostics
  const handleTestConnection = async () => {
    if (!activeConnection?.id) return;
    setIsTesting(true);
    try {
      const response = await testConnectionMutation({
        variables: { connectionId: activeConnection.id },
      });

      const result = response.data?.testWhatsAppConnection;
      if (result?.connected) {
        toast.success(
          `Connection Healthy! Verified: "${result.verifiedName || activeConnection.verifiedName || "Active"}" | Quality: ${result.qualityRating || "GREEN"}`,
        );
      } else {
        toast.error(
          result?.error || "WhatsApp connection test reported an issue.",
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to test WhatsApp connection";
      toast.error(msg);
    } finally {
      setIsTesting(false);
    }
  };

  // 7. Sync Pre-Approved Templates from Meta
  const handleSyncTemplates = async () => {
    if (!activeConnection?.id) return;
    setIsSyncing(true);
    try {
      const response = await syncTemplatesMutation({
        variables: { connectionId: activeConnection.id },
      });

      const templates = response.data?.syncWhatsAppTemplates || [];
      toast.success(
        `Synchronized ${templates.length} pre-approved template${templates.length === 1 ? "" : "s"} from Meta!`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync WhatsApp templates";
      toast.error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  // 8. Disconnect Handler
  const handleDisconnect = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1111";
      const token =
        typeof window !== "undefined" ? localStorage.getItem("key") : null;

      await fetch(`${backendUrl}/integrations/whatsapp/disconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          connectionId: activeConnection?.id,
        }),
      }).catch(() => null);

      setOptimisticConnection(null);
      sessionAssetsRef.current = null;
      await refetchConnections();
      toast.info("WhatsApp Business Account disconnected.");
    } catch {
      setOptimisticConnection(null);
      toast.info("WhatsApp disconnected.");
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoadingConnections && !connectionsData) {
    return <IntegrationCardSkeleton />;
  }

  // Quality badge styling helper
  const getQualityBadge = (rating?: string) => {
    const r = (rating || "GREEN").toUpperCase();
    if (r === "GREEN") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 text-[11px] font-medium"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> High Quality
        </Badge>
      );
    }
    if (r === "YELLOW") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 text-[11px] font-medium"
        >
          <AlertCircle className="w-3 h-3 text-amber-500" /> Medium Quality
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 gap-1 text-[11px] font-medium"
      >
        <AlertCircle className="w-3 h-3 text-rose-500" /> Low Quality
      </Badge>
    );
  };

  return (
    <>
      <IntegrationCard
        title="WhatsApp Cloud API"
        category="Communication"
        description="Connect your official Meta WhatsApp Business Account for transactional notifications, automated event reminders, and Coexistence mode support."
        icon={WhatsAppIcon}
        iconBgColor="bg-[#25D366]"
        badge={
          activeConnection?.environment === "SANDBOX"
            ? "Sandbox Mode"
            : "Meta Tech Provider"
        }
        docsUrl="https://developers.facebook.com/docs/whatsapp/cloud-api"
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        customAction={
          !isConnected ? (
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsTestModalOpen(true)}
                className="h-7 text-[11px] px-2 gap-1 rounded-[6px] font-medium border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700 cursor-pointer shadow-2xs"
                title="Connect directly with temporary access token from Meta App Dashboard"
              >
                <KeyRound className="w-3 h-3 text-amber-500" />
                <span>Test Key</span>
              </Button>
              <CtaButton
                size="sm"
                className="h-7 text-[11px] px-2.5 gap-1 rounded-[6px] font-medium transition-all duration-150 active:scale-98 shadow-2xs cursor-pointer"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                    <span>Connecting…</span>
                  </>
                ) : (
                  <>
                    <span>Connect</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover/card:translate-x-0.5 transition-transform duration-150" />
                  </>
                )}
              </CtaButton>
            </div>
          ) : undefined
        }
      >
        {isConnected && activeConnection && (
          <div className="space-y-3 pt-1">
            {/* Status Header Strip */}
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/25 px-2.5 py-1.5 rounded-[6px]">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11.5px] font-semibold text-emerald-800 dark:text-emerald-300">
                  {activeConnection.environment === "SANDBOX"
                    ? "Sandbox Channel Active"
                    : "Official Channel Active"}
                </span>
              </div>
              <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-mono">
                Graph API {graphApiVersion}
              </span>
            </div>

            {/* Connection Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Verified Name */}
              <div className="p-2.5 rounded-[6px] bg-white dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#616161] dark:text-zinc-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
                  Name
                </span>
                <p className="font-semibold text-[#303030] dark:text-zinc-100 text-[12px] truncate">
                  {activeConnection.verifiedName || "Official Channel"}
                </p>
              </div>

              {/* Display Phone */}
              <div className="p-2.5 rounded-[6px] bg-white dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#616161] dark:text-zinc-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-primary" /> Display Phone
                </span>
                <p className="font-mono font-semibold text-[#303030] dark:text-zinc-100 text-[12px] truncate">
                  {activeConnection.displayPhoneNumber ||
                    activeConnection.phoneNumber ||
                    "Active Number"}
                </p>
              </div>

              {/* Quality Rating */}
              <div className="p-2.5 rounded-[6px] bg-white dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#616161] dark:text-zinc-400">
                  Health & Quality
                </span>
                <div>{getQualityBadge(activeConnection.qualityRating)}</div>
              </div>

              {/* WABA ID */}
              <div className="p-2.5 rounded-[6px] bg-white dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#616161] dark:text-zinc-400">
                    WABA ID
                  </span>
                  {activeConnection.wabaId && (
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(activeConnection.wabaId!, "WABA ID")
                      }
                      className="text-[#8c9196] hover:text-[#303030] dark:hover:text-zinc-200 transition-colors p-0.5 cursor-pointer"
                      title="Copy WABA ID"
                    >
                      {copiedField === "WABA ID" ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
                <p className="font-mono text-[11px] text-[#616161] dark:text-zinc-400 truncate">
                  {activeConnection.wabaId || "Managed Provider"}
                </p>
              </div>
            </div>

            {/* Badges / Mode Info */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700 gap-1 font-normal rounded-[4px]"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> Coexistence
                Enabled
              </Badge>
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700 gap-1 font-normal rounded-[4px]"
              >
                <Layers className="w-3 h-3 text-blue-500" /> Webhook
                Auto-Subscribed
              </Badge>
              {activeConnection.environment === "SANDBOX" && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 gap-1 font-normal rounded-[4px]"
                >
                  <FlaskConical className="w-3 h-3 text-amber-500" /> Sandbox
                  Mode
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1 h-7.5 text-[11px] gap-1.5 rounded-[6px] border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700 font-medium cursor-pointer"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span>Test Connection</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSyncTemplates}
                disabled={isSyncing}
                className="flex-1 h-7.5 text-[11px] gap-1.5 rounded-[6px] border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700 font-medium cursor-pointer"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span>Sync Templates</span>
              </Button>
            </div>

            {/* Link to Marketing Hub */}
            <div className="pt-0.5">
              <Link
                href="/marketing/whatsapp"
                className="flex items-center justify-center gap-1.5 w-full h-8 text-[11.5px] rounded-[6px] bg-[#25D366] hover:bg-[#1ebe5a] text-white font-medium shadow-2xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open WhatsApp Marketing Hub</span>
              </Link>
            </div>

            {/* Quick Link to Update Test Key */}
            <div className="flex items-center justify-between pt-1 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 text-[11px]">
              <span className="text-[10.5px] text-[#616161] dark:text-zinc-400">
                Testing with temporary token?
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTestFormData({
                    accessToken: "",
                    phoneNumberId: activeConnection.phoneNumberId || "",
                    wabaId: activeConnection.wabaId || "",
                    phoneNumber:
                      activeConnection.phoneNumber ||
                      activeConnection.displayPhoneNumber ||
                      "",
                    verifiedName: activeConnection.verifiedName || "",
                  });
                  setIsTestModalOpen(true);
                }}
                className="h-6 text-[10.5px] px-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                Update Test Key
              </Button>
            </div>
          </div>
        )}
      </IntegrationCard>

      {/* Test Key / Sandbox Connect Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#25D366]">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5">
                  Connect WhatsApp Test Key
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                  >
                    Sandbox
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-[#616161] dark:text-zinc-400 mt-0.5">
                  Use temporary credentials from Meta Developer Dashboard to
                  test without App Review.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Quick instructions banner */}
          <div className="rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
            <p className="font-medium flex items-center justify-between text-[11.5px]">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                From Meta App Dashboard &rarr; WhatsApp &rarr; API Setup:
              </span>
              <a
                href={
                  metaAppId
                    ? `https://developers.facebook.com/apps/${metaAppId}/whatsapp-business/wa-dev-console/`
                    : "https://developers.facebook.com/apps"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-amber-700 dark:text-amber-400 underline hover:text-amber-900 text-[10.5px]"
              >
                Open Dashboard <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/80 dark:text-amber-300/80 ml-1">
              <li>
                Copy the <strong>Temporary access token</strong> (24h validity)
              </li>
              <li>
                Copy the <strong>Phone number ID</strong> from Step 1
              </li>
              <li>
                Copy the <strong>WhatsApp Business Account ID</strong> (WABA ID)
              </li>
            </ul>
          </div>

          <form onSubmit={handleConnectWithTestKey} className="space-y-3 pt-1">
            {/* Access Token */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="test-access-token"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-200"
                >
                  Temporary Access Token{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowTokenText(!showTokenText)}
                  className="text-[10.5px] text-[#616161] hover:text-[#303030] dark:text-zinc-400 flex items-center gap-1 cursor-pointer"
                >
                  {showTokenText ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> Show
                    </>
                  )}
                </button>
              </div>
              <Input
                id="test-access-token"
                type={showTokenText ? "text" : "password"}
                placeholder="EA..."
                value={testFormData.accessToken}
                onChange={(e) =>
                  setTestFormData((prev) => ({
                    ...prev,
                    accessToken: e.target.value,
                  }))
                }
                required
                className="font-mono text-xs h-8.5 bg-white dark:bg-zinc-800"
              />
            </div>

            {/* IDs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label
                  htmlFor="test-phone-id"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-200"
                >
                  Phone Number ID <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="test-phone-id"
                  type="text"
                  placeholder="e.g. 106554867493234"
                  value={testFormData.phoneNumberId}
                  onChange={(e) =>
                    setTestFormData((prev) => ({
                      ...prev,
                      phoneNumberId: e.target.value,
                    }))
                  }
                  required
                  className="font-mono text-xs h-8.5 bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="test-waba-id"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-200"
                >
                  WABA ID <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="test-waba-id"
                  type="text"
                  placeholder="e.g. 104234589234823"
                  value={testFormData.wabaId}
                  onChange={(e) =>
                    setTestFormData((prev) => ({
                      ...prev,
                      wabaId: e.target.value,
                    }))
                  }
                  required
                  className="font-mono text-xs h-8.5 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Optional Display phone & Verified Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label
                  htmlFor="test-phone-num"
                  className="text-xs font-medium text-[#616161] dark:text-zinc-400"
                >
                  Test Phone Number (Optional)
                </Label>
                <Input
                  id="test-phone-num"
                  type="text"
                  placeholder="e.g. +1 555 025 8483"
                  value={testFormData.phoneNumber}
                  onChange={(e) =>
                    setTestFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="font-mono text-xs h-8.5 bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="test-name"
                  className="text-xs font-medium text-[#616161] dark:text-zinc-400"
                >
                  Test Channel Name (Optional)
                </Label>
                <Input
                  id="test-name"
                  type="text"
                  placeholder="e.g. Meta Cloud Sandbox"
                  value={testFormData.verifiedName}
                  onChange={(e) =>
                    setTestFormData((prev) => ({
                      ...prev,
                      verifiedName: e.target.value,
                    }))
                  }
                  className="text-xs h-8.5 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsTestModalOpen(false)}
                className="h-8 text-xs rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isConnectingDirect}
                className="h-8 text-xs rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-medium cursor-pointer"
              >
                {isConnectingDirect ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Connecting & Verifying…
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                    Connect Sandbox
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
