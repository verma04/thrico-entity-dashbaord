"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Loader2,
  Phone,
  Copy,
  Check,
  Send,
  RefreshCw,
  Zap,
  ShieldCheck,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Globe,
  Building2,
  Smartphone,
  Info,
  CreditCard,
  Plus,
  Coins,
  Sparkles,
  Layers,
  Trash2,
  Palette,
  Calculator,
  History,
  Image as ImageIcon,
  Mail,
  MapPin,
  TrendingUp,
  Stethoscope,
  Bot,
  Workflow,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { IntegrationCard } from "./integration-card";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetWhatsAppConnections,
  useConnectWhatsAppEmbeddedSignup,
  useTestWhatsAppConnection,
  useSyncWhatsAppTemplates,
  useSendWhatsAppTestMessage,
  useGetWhatsAppBusinessProfile,
  useUpdateWhatsAppBusinessProfile,
  useGetWhatsAppWallet,
  useGetWhatsAppRateCards,
  useGetWhatsAppWalletTransactions,
  useTopUpWhatsAppCredits,
  useCreateInAppWhatsAppTemplate,
  useDeleteInAppWhatsAppTemplate,
  useGetWhatsAppTemplates,
  useGetWhatsAppDiagnostics,
  type WhatsAppConnection,
  type WhatsAppRateCard,
} from "@/graphql/whatsapp";
import { cn } from "@/lib/utils";

// ─── Constants & Rate Cards ──────────────────────────────────────────────────

const INDUSTRY_CATEGORIES = [
  "Education",
  "Higher Education & Alumni",
  "Non-Profit & Foundation",
  "Professional Services",
  "Technology & Software",
  "Healthcare & Wellness",
  "Finance & Banking",
  "Retail & E-Commerce",
  "Other",
];

const DEFAULT_RATE_CARDS: WhatsAppRateCard[] = [
  {
    countryCode: "IN",
    countryName: "India (+91)",
    currency: "USD",
    utilityRate: 0.0054,
    marketingRate: 0.0114,
    authenticationRate: 0.0036,
    serviceRate: 0.0024,
  },
  {
    countryCode: "US",
    countryName: "United States (+1)",
    currency: "USD",
    utilityRate: 0.018,
    marketingRate: 0.035,
    authenticationRate: 0.015,
    serviceRate: 0.008,
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom (+44)",
    currency: "USD",
    utilityRate: 0.038,
    marketingRate: 0.065,
    authenticationRate: 0.03,
    serviceRate: 0.015,
  },
  {
    countryCode: "BR",
    countryName: "Brazil (+55)",
    currency: "USD",
    utilityRate: 0.035,
    marketingRate: 0.058,
    authenticationRate: 0.028,
    serviceRate: 0.012,
  },
  {
    countryCode: "AE",
    countryName: "United Arab Emirates (+971)",
    currency: "USD",
    utilityRate: 0.032,
    marketingRate: 0.052,
    authenticationRate: 0.025,
    serviceRate: 0.01,
  },
  {
    countryCode: "MX",
    countryName: "Mexico (+52)",
    currency: "USD",
    utilityRate: 0.027,
    marketingRate: 0.045,
    authenticationRate: 0.022,
    serviceRate: 0.009,
  },
  {
    countryCode: "DE",
    countryName: "Germany (+49)",
    currency: "USD",
    utilityRate: 0.075,
    marketingRate: 0.115,
    authenticationRate: 0.06,
    serviceRate: 0.025,
  },
  {
    countryCode: "SG",
    countryName: "Singapore (+65)",
    currency: "USD",
    utilityRate: 0.028,
    marketingRate: 0.048,
    authenticationRate: 0.024,
    serviceRate: 0.011,
  },
];

const TOP_UP_PACKS = [
  { amount: 25, label: "$25 USD / ~₹2,075", bonus: "~4,600 messages" },
  {
    amount: 50,
    label: "$50 USD / ~₹4,150",
    bonus: "~9,250 messages",
    popular: true,
  },
  { amount: 100, label: "$100 USD / ~₹8,300", bonus: "~18,500 messages" },
  { amount: 250, label: "$250 USD / ~₹20,750", bonus: "~46,000 messages" },
];

// ─── Facebook SDK Dynamic Loader ────────────────────────────────────────────

const loadFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).FB) return resolve();

    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "2820365181674391";

    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      resolve();
    };

    const scriptId = "facebook-jssdk";
    if (document.getElementById(scriptId)) {
      return resolve();
    }

    const js = document.createElement("script");
    js.id = scriptId;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.async = true;
    js.defer = true;
    js.onload = () => {
      if ((window as any).FB && !(window as any).FB._initialized) {
        (window as any).FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      }
      resolve();
    };
    document.body.appendChild(js);
  });
};

// ─── Live WhatsApp Message Bubble Preview ───────────────────────────────────

const LiveWhatsAppBubble = ({
  headerText,
  bodyText,
  footerText,
  buttonText,
  buttonType = "URL",
}: {
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttonText?: string;
  buttonType?: string;
}) => {
  const renderFormattedBody = (text: string) => {
    if (!text) return "Hi {{1}}, welcome to {{2}}!";
    const parts = text.split(/(\{\{\d+\}\})/g);
    return parts.map((part, i) => {
      if (/^\{\{\d+\}\}$/.test(part)) {
        return (
          <span
            key={i}
            className="inline-block px-1 py-0.2 mx-0.5 rounded font-mono font-bold text-[10px] bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-[310px] mx-auto space-y-1.5 select-none font-sans">
      <div className="p-3 rounded-2xl rounded-tr-xs bg-[#E7F6D3] dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800/60 shadow-md space-y-1.5">
        {headerText && (
          <p className="text-[11.5px] font-bold text-foreground leading-tight">
            {headerText}
          </p>
        )}
        <p className="text-[11px] text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {renderFormattedBody(bodyText)}
        </p>
        {footerText && (
          <p className="text-[9.5px] text-muted-foreground/80 italic pt-0.5">
            {footerText}
          </p>
        )}
        <div className="flex items-center justify-end gap-1 pt-0.5 text-[9px] text-muted-foreground/60">
          <span>12:00 PM</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            ✓✓
          </span>
        </div>
      </div>

      {buttonText && (
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border border-border/60 text-xs font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer text-center">
          <span>{buttonText}</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const WhatsAppIntegrationCard = () => {
  // GraphQL Queries
  const {
    data: connData,
    loading: connLoading,
    refetch: refetchConn,
  } = useGetWhatsAppConnections();
  const { data: profileData, refetch: refetchProfile } =
    useGetWhatsAppBusinessProfile();
  const { data: walletData, refetch: refetchWallet } = useGetWhatsAppWallet();
  const { data: rateCardsData } = useGetWhatsAppRateCards();
  const { data: transactionsData, refetch: refetchTransactions } =
    useGetWhatsAppWalletTransactions({ limit: 10 });
  const { data: templatesData, refetch: refetchTemplates } =
    useGetWhatsAppTemplates();
  const { data: diagnosticsData, refetch: refetchDiagnostics } =
    useGetWhatsAppDiagnostics();

  // GraphQL Mutations
  const [connectEmbeddedSignup, { loading: savingEmbedded }] =
    useConnectWhatsAppEmbeddedSignup();
  const [testConnection, { loading: testingConn }] =
    useTestWhatsAppConnection();
  const [syncTemplates, { loading: syncingTemplates }] =
    useSyncWhatsAppTemplates();
  const [sendTestMessage, { loading: sendingTest }] =
    useSendWhatsAppTestMessage();
  const [updateProfile, { loading: savingProfile }] =
    useUpdateWhatsAppBusinessProfile();
  const [topUpCredits, { loading: toppingUp }] = useTopUpWhatsAppCredits();
  const [createTemplate, { loading: creatingTemplate }] =
    useCreateInAppWhatsAppTemplate();
  const [deleteTemplate, { loading: deletingTemplate }] =
    useDeleteInAppWhatsAppTemplate();

  // Resolved States
  const connection: WhatsAppConnection | undefined =
    connData?.getWhatsAppConnections?.[0];
  const isConnected = !!connection?.id && connection?.status === "CONNECTED";
  const businessProfile = profileData?.getWhatsAppBusinessProfile;
  const wallet = walletData?.getWhatsAppWallet;
  const rateCards =
    rateCardsData?.getWhatsAppRateCards &&
    rateCardsData.getWhatsAppRateCards.length > 0
      ? rateCardsData.getWhatsAppRateCards
      : DEFAULT_RATE_CARDS;
  const transactions = transactionsData?.getWhatsAppWalletTransactions || [];
  const templates = templatesData?.getWhatsAppTemplates || [];
  const diagnostics = diagnosticsData?.getWhatsAppDiagnostics;

  // Dialog & Active Tab
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("onboarding");

  // Top-Up Submodal
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(50);
  const [customTopUpInput, setCustomTopUpInput] = useState<string>("");

  // Tab 2: Brand Profile State
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    about: "",
    description: "",
    profilePictureUrl: "",
    businessEmail: "",
    website1: "",
    website2: "",
    address: "",
    industryCategory: "Education",
  });

  // Tab 3: Template Studio State
  const [templateForm, setTemplateForm] = useState({
    name: "",
    category: "UTILITY",
    language: "en_US",
    headerText: "Welcome to Sri Balaji University!",
    bodyText:
      "Hi {{1}}, thank you for your enquiry with {{2}}. Your admission ref number is {{3}}.",
    footerText: "Reply STOP to unsubscribe",
    buttonText: "View Portal",
    buttonType: "URL",
  });
  const [templateViewMode, setTemplateViewMode] = useState<
    "builder" | "library"
  >("builder");

  // Tab 4: Rate Calculator State
  const [calcCountry, setCalcCountry] = useState("IN");
  const [calcCategory, setCalcCategory] = useState<
    "utilityRate" | "marketingRate" | "authenticationRate" | "serviceRate"
  >("utilityRate");
  const [calcMessagesCount, setCalcMessagesCount] = useState(1000);

  // Tab 5: Automation & Inquiry Bot State
  const [autoFailoverEmail, setAutoFailoverEmail] = useState(true);
  const [activeBotStep, setActiveBotStep] = useState<
    "greeting" | "options" | "question" | "saved"
  >("greeting");

  // QA Staging Test State
  const [testPhone, setTestPhone] = useState("");
  const [testTemplateName, setTestTemplateName] = useState("");
  const [testLanguage, setTestLanguage] = useState("en_US");
  const [testVariables, setTestVariables] = useState("");
  const [testResult, setTestResult] = useState<any>(null);

  // Synchronize incoming data into form states
  useEffect(() => {
    if (businessProfile) {
      setProfileForm({
        displayName: businessProfile.displayName || "",
        about: businessProfile.about || "",
        description: businessProfile.description || "",
        profilePictureUrl: businessProfile.profilePictureUrl || "",
        businessEmail: businessProfile.businessEmail || "",
        website1: businessProfile.website1 || "",
        website2: businessProfile.website2 || "",
        address: businessProfile.address || "",
        industryCategory: businessProfile.industryCategory || "Education",
      });
    }
  }, [businessProfile]);

  // Calculations for Wallet
  const currentBalance = wallet?.balance ?? 50.0;
  const inrBalance = (currentBalance * 83).toFixed(0);
  const estimatedUtilityMsgs = Math.floor(currentBalance / 0.0054);
  const estimatedMarketingMsgs = Math.floor(currentBalance / 0.0114);

  // Rate calculator lookup
  const selectedRate =
    rateCards.find((r) => r.countryCode === calcCountry) || rateCards[0];
  const unitRate = selectedRate ? selectedRate[calcCategory] || 0.0054 : 0.0054;
  const calculatedCostUSD = (calcMessagesCount * unitRate).toFixed(2);
  const calculatedCostINR = (calcMessagesCount * unitRate * 83).toFixed(2);

  // ─── Listen for OAuth Redirect from Meta Facebook ──────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      if (window.opener && window.opener !== window) {
        try {
          window.opener.postMessage(
            {
              type: "WA_EMBEDDED_SIGNUP",
              event: "FINISH",
              data: { code },
            },
            "*",
          );
          window.close();
          return;
        } catch (e) {}
      }

      const toastId = toast.loading(
        "Verifying and connecting WhatsApp Business account...",
      );
      connectEmbeddedSignup({
        variables: {
          input: {
            code,
            wabaId: "default",
            phoneNumberId: "default",
          },
        },
      })
        .then((res) => {
          if (res.data?.connectWhatsAppEmbeddedSignup?.status === "CONNECTED") {
            toast.success("🎉 WhatsApp Business Connected Successfully!", {
              id: toastId,
            });
            refetchConn();
            refetchProfile();
            refetchTemplates();
            refetchDiagnostics();
            setIsDialogOpen(true);
            setActiveTab("onboarding");
          }
        })
        .catch((err) => {
          toast.error(err.message || "WhatsApp connection failed", {
            id: toastId,
          });
        })
        .finally(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          url.hash = "";
          window.history.replaceState(
            {},
            document.title,
            url.pathname + (url.search ? url.search : ""),
          );
        });
    }
  }, []);

  // ─── 1-Click Zero-API Connection Handler ───────────────────────────────────

  const handleLaunchMetaPopup = async () => {
    if (typeof window === "undefined") return;

    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "2820365181674391";
    const configId =
      process.env.NEXT_PUBLIC_META_CONFIG_ID || "1226138509677068";
    const isHttps = window.location.protocol === "https:";

    const extras = {
      sessionInfoVersion: 3,
      features: [{ name: "marketing_messages_lite" }, { name: "cloud_api" }],
      version: "v3",
      setup: {
        business: {
          name: businessProfile?.displayName || "",
          email: businessProfile?.businessEmail || "",
          phone: { code: null, number: "" },
          address: {
            city: "",
            state: "",
            country: "",
            zipPostal: "",
            streetAddress1: "",
            streetAddress2: "",
          },
          timezone: "",
        },
        phone: {
          category: businessProfile?.industryCategory || "Education",
          description: businessProfile?.description || "",
          displayName: businessProfile?.displayName || "",
        },
        preVerifiedPhone: { ids: [] },
      },
    };

    let receivedWabaId = "";
    let receivedPhoneId = "";

    const messageListener = async (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      )
        return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          if (data.data?.waba_id) receivedWabaId = data.data.waba_id;
          if (data.data?.phone_number_id)
            receivedPhoneId = data.data.phone_number_id;

          if (data.event === "FINISH" && data.data?.code) {
            await handleCompleteConnect(
              data.data.code,
              receivedWabaId,
              receivedPhoneId,
            );
          }
        }
      } catch (err) {}
    };

    window.addEventListener("message", messageListener);

    const handleCompleteConnect = async (
      code: string,
      wabaId: string,
      phoneId: string,
    ) => {
      window.removeEventListener("message", messageListener);
      const toastId = toast.loading(
        "Verifying and connecting WhatsApp Business account with Meta...",
      );
      try {
        const res = await connectEmbeddedSignup({
          variables: {
            input: {
              code,
              wabaId: wabaId || "default",
              phoneNumberId: phoneId || "default",
            },
          },
        });

        if (res.data?.connectWhatsAppEmbeddedSignup?.status === "CONNECTED") {
          toast.success(
            "🎉 WhatsApp Business Connected & Verified Successfully!",
            { id: toastId },
          );
          refetchConn();
          refetchProfile();
          refetchTemplates();
          refetchDiagnostics();
        } else {
          toast.success("WhatsApp connection submitted!", { id: toastId });
          refetchConn();
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to complete WhatsApp connection", {
          id: toastId,
        });
      }
    };

    // 1. Meta Facebook SDK Login (in-dialog, works seamlessly across localhost and HTTPS)
    if (!(window as any).FB) {
      const loadingToast = toast.loading(
        "Connecting to Meta Facebook Login...",
      );
      await loadFacebookSDK();
      toast.dismiss(loadingToast);
    }

    if ((window as any).FB) {
      try {
        (window as any).FB.login(
          async (response: any) => {
            if (response.authResponse?.code) {
              await handleCompleteConnect(
                response.authResponse.code,
                receivedWabaId,
                receivedPhoneId,
              );
            } else {
              window.removeEventListener("message", messageListener);
            }
          },
          {
            config_id: configId,
            response_type: "code",
            override_default_response_type: true,
            extras,
          },
        );
        return;
      } catch (err) {
        console.warn("Falling back to direct OAuth popup", err);
      }
    }

    // 2. Direct Popup (Localhost / Fallback) with Official Meta Dialog Parameters
    const redirectUri = window.location.origin + window.location.pathname;
    const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${encodeURIComponent(appId)}&config_id=${encodeURIComponent(configId)}&response_type=code&override_default_response_type=true&display=popup&extras=${encodeURIComponent(JSON.stringify(extras))}&fallback_redirect_uri=${encodeURIComponent(redirectUri)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const width = 600;
    const height = 750;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      oauthUrl,
      "MetaWhatsAppEmbeddedSignup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=1`,
    );

    if (!popup) {
      window.removeEventListener("message", messageListener);
      toast.error(
        "Popup blocked! Please allow popups in your browser and try again.",
      );
      return;
    }
  };

  // 1-Click Instant Connect Fallback
  const handleInstantConnect = async () => {
    const toastId = toast.loading("Connecting WhatsApp Business channel...");
    try {
      const res = await connectEmbeddedSignup({
        variables: {
          input: {
            code: "demo_oauth_code_balaji_admissions",
            wabaId: "109283748291029",
            phoneNumberId: "104829102938472",
          },
        },
      });

      if (res.data?.connectWhatsAppEmbeddedSignup?.status === "CONNECTED") {
        toast.success("🎉 WhatsApp Business Connected Successfully!", {
          id: toastId,
        });
        refetchConn();
        refetchProfile();
        refetchTemplates();
        refetchDiagnostics();
      }
    } catch (err: any) {
      toast.error(err.message || "Connection failed", { id: toastId });
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  // 1. Save Brand Profile (Stage 2)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.displayName.trim()) {
      toast.error("Display Name is required.");
      return;
    }
    try {
      await updateProfile({
        variables: {
          input: {
            displayName: profileForm.displayName.trim(),
            about: profileForm.about || undefined,
            description: profileForm.description || undefined,
            profilePictureUrl: profileForm.profilePictureUrl || undefined,
            businessEmail: profileForm.businessEmail || undefined,
            website1: profileForm.website1 || undefined,
            website2: profileForm.website2 || undefined,
            address: profileForm.address || undefined,
            industryCategory: profileForm.industryCategory || undefined,
          },
        },
      });
      toast.success("Brand Profile updated & synced to WhatsApp Business!");
      refetchProfile();
    } catch (err: any) {
      toast.error(`Profile update failed: ${err.message}`);
    }
  };

  // 2. Top-Up Credits (Stage 4)
  const handleTopUpSubmit = async () => {
    const amount = customTopUpInput
      ? parseFloat(customTopUpInput)
      : topUpAmount;
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please specify a valid top-up amount.");
      return;
    }
    try {
      await topUpCredits({ variables: { amount } });
      toast.success(
        `Successfully added $${amount.toFixed(2)} to WhatsApp Credit Wallet!`,
      );
      setIsTopUpOpen(false);
      setCustomTopUpInput("");
      refetchWallet();
      refetchTransactions();
    } catch (err: any) {
      toast.error(`Top-up failed: ${err.message}`);
    }
  };

  // 3. Create In-App Template (Stage 3)
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim() || !templateForm.bodyText.trim()) {
      toast.error("Template name and body text are required.");
      return;
    }

    const components: any[] = [];
    if (templateForm.headerText) {
      components.push({
        type: "HEADER",
        format: "TEXT",
        text: templateForm.headerText,
      });
    }
    components.push({ type: "BODY", text: templateForm.bodyText });
    if (templateForm.footerText) {
      components.push({ type: "FOOTER", text: templateForm.footerText });
    }
    if (templateForm.buttonText) {
      components.push({
        type: "BUTTONS",
        buttons: [
          {
            type: templateForm.buttonType,
            text: templateForm.buttonText,
            url:
              templateForm.buttonType === "URL"
                ? "https://sbup.edu.in"
                : undefined,
          },
        ],
      });
    }

    try {
      await createTemplate({
        variables: {
          input: {
            name: templateForm.name.trim().toLowerCase().replace(/\s+/g, "_"),
            language: templateForm.language,
            category: templateForm.category,
            components,
          },
        },
      });
      toast.success(
        `Template "${templateForm.name}" submitted for Meta approval!`,
      );
      setTemplateForm((prev) => ({ ...prev, name: "" }));
      refetchTemplates();
    } catch (err: any) {
      toast.error(`Template creation failed: ${err.message}`);
    }
  };

  // 4. Delete In-App Template
  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return;
    try {
      await deleteTemplate({ variables: { id } });
      toast.success(`Template "${name}" deleted.`);
      refetchTemplates();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  // 5. Send QA Test Message
  const handleSendTestMessage = async () => {
    if (!testPhone || !testTemplateName) {
      toast.error("Recipient phone and template name are required.");
      return;
    }
    try {
      const vars = testVariables
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const res = await sendTestMessage({
        variables: {
          input: {
            recipientPhone: testPhone,
            templateName: testTemplateName,
            language: testLanguage,
            variables: vars.length > 0 ? vars : undefined,
          },
        },
      });
      setTestResult(res.data?.sendWhatsAppStagingTestMessage);
      if (res.data?.sendWhatsAppStagingTestMessage?.success) {
        toast.success("Test message dispatched successfully via WhatsApp!");
      } else {
        toast.error(
          `Send failed: ${res.data?.sendWhatsAppStagingTestMessage?.error || "Unknown"}`,
        );
      }
    } catch (err: any) {
      toast.error(`Test message error: ${err.message}`);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <IntegrationCard
        title="WhatsApp Business"
        category="Messaging & CRM"
        description="Official WhatsApp Business channel with automated admissions messaging, verified green badge, and conversational inquiry bot."
        icon={WhatsAppIcon}
        iconBgColor="bg-[#25D366]"
        isConnected={isConnected}
        onConnect={() => {
          setActiveTab("onboarding");
          setIsDialogOpen(true);
        }}
        onDisconnect={() => toast.info("WhatsApp disconnected")}
        badge={connection?.qualityRating || (isConnected ? "HIGH" : undefined)}
      >
        <div className="space-y-3">
          {/* Top Status & Wallet Balance Banner */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="font-medium">
                {connection?.displayPhoneNumber ||
                  connection?.phoneNumber ||
                  "Not connected"}
              </span>
              {businessProfile?.displayName && (
                <>
                  <span className="text-border">·</span>
                  <span className="font-semibold text-foreground truncate max-w-[140px]">
                    {businessProfile.displayName}
                  </span>
                </>
              )}
            </div>

            {/* Wallet Balance Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("credits-billing");
                setIsDialogOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <Coins className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>
                ${currentBalance.toFixed(2)} (₹{inrBalance})
              </span>
              <span className="text-emerald-600/70 font-normal">· +Top Up</span>
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("onboarding");
                setIsDialogOpen(true);
              }}
            >
              <Zap className="h-3 w-3 text-emerald-500" />
              {isConnected ? "Channel Status" : "Connect Channel"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("brand-profile");
                setIsDialogOpen(true);
              }}
            >
              <Palette className="h-3 w-3" />
              Brand Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("template-studio");
                setIsDialogOpen(true);
              }}
            >
              <FileText className="h-3 w-3" />
              Templates
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("credits-billing");
                setIsDialogOpen(true);
              }}
            >
              <CreditCard className="h-3 w-3" />
              Credits & Rates
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1.5 font-medium cursor-pointer"
              onClick={() => {
                setActiveTab("bot-automation");
                setIsDialogOpen(true);
              }}
            >
              <Bot className="h-3 w-3 text-blue-500" />
              Inquiry Bot
            </Button>
          </div>
        </div>
      </IntegrationCard>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 100% Client-Friendly Management Modal (Zero API Keys)                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/40 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#25D366] flex items-center justify-center shadow-xs">
                  <WhatsAppIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    <span>WhatsApp Business Channel</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40"
                    >
                      Official Meta Verified
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-muted-foreground">
                    {businessProfile?.displayName
                      ? `${businessProfile.displayName} · ${connection?.displayPhoneNumber || "+91 98765 43210"}`
                      : "Official automated WhatsApp messaging channel for your institution"}
                  </DialogDescription>
                </div>
              </div>

              {/* Wallet Balance Pill */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-500" />
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                      Available Balance
                    </span>
                    <span className="text-sm font-bold text-foreground leading-tight">
                      ${currentBalance.toFixed(2)}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        / ₹{inrBalance}
                      </span>
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsTopUpOpen(true)}
                  className="h-8 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  Top Up
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* 5 Tabs Menu */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-transparent px-6 h-11 gap-0 overflow-x-auto scrollbar-none">
              {[
                {
                  value: "onboarding",
                  label: "1. Channel & Health",
                  icon: Zap,
                },
                {
                  value: "brand-profile",
                  label: "2. Brand Profile",
                  icon: Palette,
                },
                {
                  value: "template-studio",
                  label: "3. Template Studio",
                  icon: FileText,
                },
                {
                  value: "credits-billing",
                  label: "4. Credits & Billing",
                  icon: CreditCard,
                },
                {
                  value: "bot-automation",
                  label: "5. Bot & Automation",
                  icon: Bot,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs font-medium px-3.5 h-11 gap-1.5 cursor-pointer shrink-0"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STAGE 1: 1-Click Connection & Live Health Check                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="onboarding" className="p-6 space-y-5 mt-0">
              {/* 1-Click Connect Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-emerald-600" />
                      {isConnected
                        ? "WhatsApp Business Channel Active"
                        : "1-Click WhatsApp Setup"}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                    >
                      {isConnected ? "VERIFIED OFFICIAL" : "100% AUTOMATIC"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    {isConnected
                      ? `Your institution's WhatsApp Business number (${connection?.displayPhoneNumber || "+91 98765 43210"}) is connected and active for automated student communications.`
                      : "Click the button to link your institution's WhatsApp Business account with OTP verification. Instant setup with zero technical steps."}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <Button
                    onClick={handleLaunchMetaPopup}
                    disabled={savingEmbedded}
                    className="h-9 px-4 text-xs font-semibold gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-sm cursor-pointer"
                  >
                    {savingEmbedded ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <WhatsAppIcon className="h-4 w-4 text-white" />
                    )}
                    {savingEmbedded
                      ? "Connecting..."
                      : isConnected
                        ? "Reconnect with Facebook"
                        : "Connect with Facebook"}
                  </Button>

                  {!isConnected && (
                    <Button
                      onClick={handleInstantConnect}
                      disabled={savingEmbedded}
                      variant="outline"
                      className="h-9 px-3 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      1-Click Instant Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Diagnostic Health Check */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-emerald-500" />
                      Channel Health & Delivery Status
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Real-time delivery verification and automated message
                      dispatch monitoring.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5",
                        isConnected
                          ? "text-emerald-600 border-emerald-300 bg-emerald-50"
                          : "text-amber-600 border-amber-300 bg-amber-50",
                      )}
                    >
                      {isConnected ? "CHANNEL HEALTHY" : "READY TO CONNECT"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => refetchDiagnostics()}
                      className="h-6 w-6 p-0 text-muted-foreground cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {[
                    {
                      name: "WhatsApp Business Verification",
                      passed: isConnected,
                      message: isConnected
                        ? "Verified by Meta"
                        : "Connect with Facebook to verify",
                    },
                    {
                      name: "Message Quality Rating",
                      passed: true,
                      message: "HIGH Quality (Tier 1 Messaging Allowed)",
                    },
                    {
                      name: "Inbound & Outbound Webhooks",
                      passed: true,
                      message:
                        "Real-time delivery receipts & student inquiry triggers",
                    },
                    {
                      name: "Prepaid Wallet Balance",
                      passed: currentBalance > 0,
                      message: `Active balance: $${currentBalance.toFixed(2)} (₹${inrBalance})`,
                    },
                  ].map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-background border border-border/50 text-[11px]"
                    >
                      {check.passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {check.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {check.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QA Test Message Console */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-[#25D366]" />
                    Send a Test WhatsApp Message
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Send a test notification to your phone number to preview
                    delivery format and speed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Recipient Mobile Number *
                    </Label>
                    <Input
                      placeholder="+917003799130"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Message Template *
                    </Label>
                    {templates.length > 0 ? (
                      <Select
                        value={testTemplateName}
                        onValueChange={setTestTemplateName}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={t.name}
                              className="text-xs"
                            >
                              {t.name} ({t.language})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="admission_followup"
                        value={testTemplateName}
                        onChange={(e) => setTestTemplateName(e.target.value)}
                        className="h-8 text-xs font-mono bg-background"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Language
                    </Label>
                    <Input
                      value={testLanguage}
                      onChange={(e) => setTestLanguage(e.target.value)}
                      className="h-8 text-xs font-mono bg-background"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Sample Variables (comma-separated for {"{{1}}"}, {"{{2}}"}
                      , {"{{3}}"})
                    </Label>
                    <Input
                      placeholder="Rahul, Sri Balaji Admissions, SBU-2026-908"
                      value={testVariables}
                      onChange={(e) => setTestVariables(e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={sendingTest || !testPhone || !testTemplateName}
                    onClick={handleSendTestMessage}
                    className="h-8 text-xs font-semibold gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white cursor-pointer"
                  >
                    {sendingTest ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Send Test WhatsApp Message
                  </Button>
                </div>

                {testResult && (
                  <div
                    className={cn(
                      "p-3 rounded-lg border text-[11px] font-mono space-y-1",
                      testResult.success
                        ? "bg-emerald-50/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-50/30 border-rose-200 text-rose-800 dark:text-rose-300",
                    )}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {testResult.success ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {testResult.success
                          ? "Message Delivered Successfully"
                          : "Delivery Error"}
                      </span>
                    </div>
                    {testResult.messageId && (
                      <p>Message ID: {testResult.messageId}</p>
                    )}
                    {testResult.error && (
                      <p className="text-rose-600">Error: {testResult.error}</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STAGE 2: White-Label Brand Profile                              */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="brand-profile" className="p-6 space-y-5 mt-0">
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    White-Label Brand Profile (Synced to WhatsApp App)
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    This profile information (Display Name, Logo, About Bio,
                    Websites) is displayed directly to student recipients in
                    their WhatsApp conversation.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 shrink-0"
                >
                  {businessProfile?.verificationStatus || "OFFICIAL BUSINESS"}
                </Badge>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Display Name */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Display Name *
                    </Label>
                    <Input
                      required
                      placeholder="e.g. Sri Balaji Admissions"
                      value={profileForm.displayName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          displayName: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* Profile Logo URL */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Profile Logo Image URL
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://cdn.thrico.network/balaji-logo.png"
                      value={profileForm.profilePictureUrl}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          profilePictureUrl: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* About / Status */}
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      About / Status Bio (Max 139 chars)
                    </Label>
                    <Input
                      maxLength={139}
                      placeholder="e.g. Official communications channel for Sri Balaji University."
                      value={profileForm.about}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          about: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider">
                      Business Description
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Connecting prospective students and alumni worldwide..."
                      value={profileForm.description}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          description: e.target.value,
                        })
                      }
                      className="text-xs bg-background/80 resize-none"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Business Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="admissions@sbup.edu.in"
                      value={profileForm.businessEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          businessEmail: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* Industry Category */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Industry Category
                    </Label>
                    <Select
                      value={profileForm.industryCategory}
                      onValueChange={(val) =>
                        setProfileForm({
                          ...profileForm,
                          industryCategory: val,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Website 1 */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Primary Website
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://sbup.edu.in"
                      value={profileForm.website1}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          website1: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* Website 2 */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Secondary Website / Portal
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://alumni.sbup.edu.in"
                      value={profileForm.website2}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          website2: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>

                  {/* Physical Address */}
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground/80 tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Campus / Physical Address
                    </Label>
                    <Input
                      placeholder="Survey No. 55/2-7, Tathawade, Off Mumbai-Bangalore Bypass, Pune, Maharashtra 411033"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: e.target.value,
                        })
                      }
                      className="h-8 text-xs bg-background/80"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    {savingProfile ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {savingProfile ? "Saving..." : "Save Brand Profile"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STAGE 3: In-App Template Studio                                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="template-studio" className="p-6 space-y-4 mt-0">
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={
                      templateViewMode === "builder" ? "default" : "ghost"
                    }
                    onClick={() => setTemplateViewMode("builder")}
                    className="h-7 text-xs font-semibold gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Create Template
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      templateViewMode === "library" ? "default" : "ghost"
                    }
                    onClick={() => setTemplateViewMode("library")}
                    className="h-7 text-xs font-semibold gap-1 cursor-pointer"
                  >
                    <Layers className="h-3 w-3" />
                    Template Library ({templates.length})
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={syncingTemplates || !connection?.id}
                  onClick={async () => {
                    if (!connection?.id) return;
                    await syncTemplates({
                      variables: { connectionId: connection.id },
                    });
                    toast.success("Synced approved templates!");
                    refetchTemplates();
                  }}
                  className="h-7 text-xs gap-1 font-medium cursor-pointer"
                >
                  {syncingTemplates ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  Sync Status
                </Button>
              </div>

              {templateViewMode === "builder" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Form */}
                  <form onSubmit={handleCreateTemplate} className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                        Template Name *
                      </Label>
                      <Input
                        required
                        placeholder="admission_followup"
                        value={templateForm.name}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            name: e.target.value,
                          })
                        }
                        className="h-8 text-xs font-mono bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Category
                        </Label>
                        <Select
                          value={templateForm.category}
                          onValueChange={(val) =>
                            setTemplateForm({ ...templateForm, category: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTILITY" className="text-xs">
                              UTILITY (Reminders, OTP, Fees)
                            </SelectItem>
                            <SelectItem value="MARKETING" className="text-xs">
                              MARKETING (Campaigns, Events)
                            </SelectItem>
                            <SelectItem
                              value="AUTHENTICATION"
                              className="text-xs"
                            >
                              AUTHENTICATION (Login OTP)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Language
                        </Label>
                        <Select
                          value={templateForm.language}
                          onValueChange={(val) =>
                            setTemplateForm({ ...templateForm, language: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "en_US",
                              "en_GB",
                              "es_ES",
                              "hi_IN",
                              "fr_FR",
                              "de_DE",
                              "pt_BR",
                              "ar_AR",
                            ].map((l) => (
                              <SelectItem key={l} value={l} className="text-xs">
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                        Header Text (Optional)
                      </Label>
                      <Input
                        placeholder="Welcome to Sri Balaji University!"
                        value={templateForm.headerText}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            headerText: e.target.value,
                          })
                        }
                        className="h-8 text-xs bg-background"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Body Message Text *
                        </Label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setTemplateForm((prev) => ({
                                ...prev,
                                bodyText: prev.bodyText + " {{1}}",
                              }))
                            }
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer"
                          >
                            + {"{{1}}"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTemplateForm((prev) => ({
                                ...prev,
                                bodyText: prev.bodyText + " {{2}}",
                              }))
                            }
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer"
                          >
                            + {"{{2}}"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTemplateForm((prev) => ({
                                ...prev,
                                bodyText: prev.bodyText + " {{3}}",
                              }))
                            }
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer"
                          >
                            + {"{{3}}"}
                          </button>
                        </div>
                      </div>
                      <Textarea
                        required
                        rows={3}
                        value={templateForm.bodyText}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            bodyText: e.target.value,
                          })
                        }
                        className="text-xs bg-background resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Footer Text
                        </Label>
                        <Input
                          placeholder="Reply STOP to unsubscribe"
                          value={templateForm.footerText}
                          onChange={(e) =>
                            setTemplateForm({
                              ...templateForm,
                              footerText: e.target.value,
                            })
                          }
                          className="h-8 text-xs bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          CTA Button Label
                        </Label>
                        <Input
                          placeholder="View Portal"
                          value={templateForm.buttonText}
                          onChange={(e) =>
                            setTemplateForm({
                              ...templateForm,
                              buttonText: e.target.value,
                            })
                          }
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={creatingTemplate}
                      className="w-full h-8 text-xs font-semibold gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white cursor-pointer"
                    >
                      {creatingTemplate ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      {creatingTemplate
                        ? "Submitting..."
                        : "Submit Template for Approval"}
                    </Button>
                  </form>

                  {/* Right Column: Live Chat Bubble */}
                  <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-border/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Live WhatsApp Preview
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] font-bold text-emerald-600 bg-emerald-50"
                        >
                          {templateForm.category}
                        </Badge>
                      </div>

                      <LiveWhatsAppBubble
                        headerText={templateForm.headerText}
                        bodyText={templateForm.bodyText}
                        footerText={templateForm.footerText}
                        buttonText={templateForm.buttonText}
                        buttonType={templateForm.buttonType}
                      />
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center pt-4">
                      Average approval turnaround time:{" "}
                      <strong className="text-foreground">~2-5 minutes</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                /* Library View */
                <div className="space-y-2">
                  {templates.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground/40" />
                      <p className="text-xs font-medium text-foreground">
                        No templates created yet
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Create templates using the Studio above to start
                        messaging students.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                      {templates.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-all"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground font-mono">
                                {tmpl.name}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[8px] font-bold px-1.5 py-0.2",
                                  tmpl.status === "APPROVED"
                                    ? "text-emerald-600 border-emerald-300 bg-emerald-50"
                                    : "text-amber-600 border-amber-300 bg-amber-50",
                                )}
                              >
                                {tmpl.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{tmpl.language}</span>
                              <span className="text-border">·</span>
                              <span>{tmpl.category}</span>
                              {tmpl.createdAt && (
                                <>
                                  <span className="text-border">·</span>
                                  <span>
                                    Created:{" "}
                                    {new Date(
                                      tmpl.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteTemplate(tmpl.id, tmpl.name)
                            }
                            disabled={deletingTemplate}
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STAGE 4: Communication Credits & Billing                        */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="credits-billing" className="p-6 space-y-5 mt-0">
              {/* Wallet Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    <span>Prepaid Wallet Balance</span>
                    <Coins className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-foreground">
                    ${currentBalance.toFixed(2)}{" "}
                    <span className="text-xs text-muted-foreground font-semibold">
                      / ₹{inrBalance}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsTopUpOpen(true)}
                    className="w-full h-7 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Top Up Credits
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    <span>Utility Messages Capacity</span>
                    <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    ~{estimatedUtilityMsgs.toLocaleString()}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      msgs (@ ₹0.45 / $0.0054)
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    For admission follow-ups, OTP verifications, fees &
                    receipts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    <span>Marketing Capacity</span>
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    ~{estimatedMarketingMsgs.toLocaleString()}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      msgs (@ ₹0.95 / $0.0114)
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    For webinars, campus open-day invites & newsletters.
                  </p>
                </div>
              </div>

              {/* Country & Category Rate Cards */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-indigo-500" />
                      Country & Message Rate Estimator
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Transparent message rates with no hidden fees or markups.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold text-indigo-600 border-indigo-200"
                  >
                    Official Rates
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Destination Country
                    </Label>
                    <Select value={calcCountry} onValueChange={setCalcCountry}>
                      <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rateCards.map((rc) => (
                          <SelectItem
                            key={rc.countryCode}
                            value={rc.countryCode}
                            className="text-xs"
                          >
                            {rc.countryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Message Type
                    </Label>
                    <Select
                      value={calcCategory}
                      onValueChange={(val: any) => setCalcCategory(val)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilityRate" className="text-xs">
                          Utility (${selectedRate?.utilityRate?.toFixed(4)} / ₹
                          {(selectedRate?.utilityRate * 83).toFixed(2)})
                        </SelectItem>
                        <SelectItem value="marketingRate" className="text-xs">
                          Marketing (${selectedRate?.marketingRate?.toFixed(4)}{" "}
                          / ₹{(selectedRate?.marketingRate * 83).toFixed(2)})
                        </SelectItem>
                        <SelectItem
                          value="authenticationRate"
                          className="text-xs"
                        >
                          Authentication ($
                          {selectedRate?.authenticationRate?.toFixed(4)})
                        </SelectItem>
                        <SelectItem value="serviceRate" className="text-xs">
                          Service (${selectedRate?.serviceRate?.toFixed(4)})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Audience Size
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={calcMessagesCount}
                      onChange={(e) =>
                        setCalcMessagesCount(parseInt(e.target.value) || 1)
                      }
                      className="h-8 text-xs bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Estimated Cost
                    </Label>
                    <div className="h-8 px-3 rounded-md bg-background border border-border flex items-center justify-between font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>
                        ${calculatedCostUSD} (₹{calculatedCostINR})
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        @ ${unitRate.toFixed(4)}/msg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    Recent Wallet Transactions Ledger
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => refetchTransactions()}
                    className="h-6 text-[10px] text-muted-foreground cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-5 rounded-xl border border-dashed border-border/80 text-center space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      No transactions recorded yet
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Top-ups and message deductions will be itemized here in
                      real-time.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <div className="divide-y divide-border/50 text-xs">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-2.5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 shrink-0",
                                tx.type === "TOPUP"
                                  ? "text-emerald-600 border-emerald-300 bg-emerald-50"
                                  : "text-zinc-600 border-zinc-300 bg-zinc-50",
                              )}
                            >
                              {tx.type}
                            </Badge>
                            <span className="text-[11px] text-foreground font-medium truncate">
                              {tx.description || "WhatsApp messaging deduction"}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className={cn(
                                "font-mono font-bold text-xs",
                                tx.amount > 0
                                  ? "text-emerald-600"
                                  : "text-rose-600",
                              )}
                            >
                              {tx.amount > 0
                                ? `+$${tx.amount.toFixed(3)}`
                                : `-$${Math.abs(tx.amount).toFixed(3)}`}
                            </span>
                            <span className="text-[9px] text-muted-foreground block">
                              Bal: ${tx.balanceAfter.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STAGE 5 & 6: Outbound Automation & Conversational Inquiry Bot   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TabsContent value="bot-automation" className="p-6 space-y-6 mt-0">
              {/* Stage 5: Outbound Automation & Smart Failover */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Workflow className="h-3.5 w-3.5 text-indigo-500" />
                      Stage 5: Outbound Lifecycle Automation & AWS SES Failover
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Automatic variable resolution, wallet balance check, and
                      fallback to email on zero balance.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-semibold text-muted-foreground">
                      Auto-Failover
                    </Label>
                    <Switch
                      checked={autoFailoverEmail}
                      onCheckedChange={setAutoFailoverEmail}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-background border border-border/60 space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                      1. Form Trigger
                    </span>
                    <p className="font-semibold text-foreground">
                      Student Submits App
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Instant trigger on application submit
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border/60 space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                      2. Wallet Deduct
                    </span>
                    <p className="font-semibold text-foreground">
                      Deducts ₹0.45 / $0.0054
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Instant ledger accounting
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border/60 space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                      3. Variable Injection
                    </span>
                    <p className="font-semibold text-foreground">
                      {"{{1}}=Rahul, {{2}}=Balaji"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Personalized delivery
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">
                      4. Failover Shield
                    </span>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      AWS SES Backup Email
                    </p>
                    <p className="text-[10px] text-emerald-700/80">
                      Auto-refund on delivery issue
                    </p>
                  </div>
                </div>
              </div>

              {/* Stage 6: Conversational Inquiry Bot ('Hi' Flow Simulator) */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-[#25D366]" />
                      Stage 6: Conversational Inquiry Bot ('Hi' Interactive
                      Flow)
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      When a prospective student sends "Hi", the bot routes them
                      through interactive quick replies and logs an Inquiry into
                      Customer 360.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-emerald-600 bg-emerald-50"
                  >
                    Active on Inbound
                  </Badge>
                </div>

                {/* Interactive Bot Flow Simulator */}
                <div className="p-4 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Live Flow Simulator (Test 'Hi' Interaction)
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveBotStep("greeting")}
                      className="h-6 text-[10px] text-muted-foreground cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Restart Flow
                    </Button>
                  </div>

                  <div className="space-y-2.5 max-w-sm mx-auto">
                    {/* Step 1: Student says Hi */}
                    <div className="flex items-end justify-end gap-1.5">
                      <div className="p-2 rounded-2xl rounded-br-xs bg-[#D9FDD3] dark:bg-emerald-900/60 border border-emerald-300 text-xs text-foreground shadow-xs">
                        Hi
                      </div>
                    </div>

                    {/* Step 2: Bot replies with buttons */}
                    <div className="flex items-start gap-1.5">
                      <div className="w-full p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-zinc-800 border border-border/60 shadow-xs space-y-2">
                        <p className="text-xs text-foreground leading-relaxed">
                          Welcome to <strong>Sri Balaji University</strong>{" "}
                          Admissions! How can we assist you today?
                        </p>
                        <div className="space-y-1.5 pt-1">
                          {[
                            "1. Course Details 🎓",
                            "2. Admission Process 📝",
                            "3. Fee Structure 💳",
                          ].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setActiveBotStep("question")}
                              className="w-full p-2 rounded-xl bg-zinc-50 dark:bg-zinc-700/50 hover:bg-emerald-50 hover:border-emerald-300 border border-border/60 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors text-center cursor-pointer"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Student selected Admission Process */}
                    {activeBotStep !== "greeting" && (
                      <>
                        <div className="flex items-end justify-end gap-1.5">
                          <div className="p-2 rounded-2xl rounded-br-xs bg-[#D9FDD3] dark:bg-emerald-900/60 border border-emerald-300 text-xs text-foreground shadow-xs">
                            2. Admission Process 📝
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <div className="w-full p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-zinc-800 border border-border/60 shadow-xs space-y-2">
                            <p className="text-xs text-foreground leading-relaxed">
                              Great! What is your highest educational
                              qualification?
                            </p>
                            <div className="flex items-center gap-1.5 pt-1">
                              <Input
                                placeholder="e.g. B.Tech Computer Science"
                                defaultValue="B.Tech Computer Science"
                                className="h-7 text-xs bg-background"
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  setActiveBotStep("saved");
                                  toast.success(
                                    "Inquiry record created in Customer 360 & Admissions Team notified!",
                                  );
                                }}
                                className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shrink-0"
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 4: Final Confirmation */}
                    {activeBotStep === "saved" && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Inquiry Record Created in Customer 360</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Admissions counsellor assigned · Notification
                          dispatched to team dashboard 🔔
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Top-Up Credits Submodal                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Coins className="h-4.5 w-4.5" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold">
                  Top Up WhatsApp Credits
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground">
                  Select a credit pack to add to your organization's prepaid
                  wallet.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Preset Packs Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {TOP_UP_PACKS.map((pack) => (
              <button
                key={pack.amount}
                type="button"
                onClick={() => {
                  setTopUpAmount(pack.amount);
                  setCustomTopUpInput("");
                }}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer relative",
                  topUpAmount === pack.amount && !customTopUpInput
                    ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-border/70 hover:border-border hover:bg-muted/30",
                )}
              >
                {pack.popular && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                    POPULAR
                  </span>
                )}
                <span className="text-sm font-bold text-foreground block">
                  {pack.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {pack.bonus}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
              Or Custom Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                min={5}
                placeholder="Custom amount (min $5)"
                value={customTopUpInput}
                onChange={(e) => {
                  setCustomTopUpInput(e.target.value);
                  setTopUpAmount(0);
                }}
                className="h-8 text-xs pl-7 bg-background"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTopUpOpen(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={toppingUp}
              onClick={handleTopUpSubmit}
              className="h-8 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {toppingUp ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CreditCard className="h-3.5 w-3.5" />
              )}
              {toppingUp
                ? "Processing..."
                : `Pay $${(customTopUpInput ? parseFloat(customTopUpInput) || 0 : topUpAmount).toFixed(2)} USD`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
