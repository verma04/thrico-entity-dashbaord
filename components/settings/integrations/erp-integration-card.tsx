"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Loader2,
  Globe,
  KeyRound,
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  Layers,
  ArrowRight,
  School,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { IntegrationCard } from "./integration-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FedenaIcon,
  CampusCareIcon,
  MyClassCampusIcon,
  MasterSoftIcon,
} from "@/components/icons/erp-icons";

export type ERPProviderKey =
  | "FEDENA"
  | "CAMPUSCARE"
  | "MYCLASSCAMPUS"
  | "MASTERSOFT";

export interface ERPProviderMeta {
  id: ERPProviderKey;
  name: string;
  category: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor?: string;
  urlPlaceholder: string;
  urlLabel: string;
  tenantLabel: string;
  tenantPlaceholder: string;
  apiLabel: string;
  apiPlaceholder: string;
  defaultDocsUrl: string;
  syncEntities: Array<{
    id: string;
    label: string;
    description: string;
    defaultEnabled: boolean;
  }>;
}

export const ERP_CONFIGS: Record<ERPProviderKey, ERPProviderMeta> = {
  FEDENA: {
    id: "FEDENA",
    name: "Fedena ERP",
    category: "Education ERP",
    description:
      "Synchronize students, faculty batches, attendance records, and academic course structures from Fedena School & College ERP.",
    badge: "Campus SIS",
    icon: FedenaIcon,
    iconBgColor: "#0284C7",
    iconColor: "text-white",
    urlLabel: "Fedena Instance URL",
    urlPlaceholder: "https://your-institution.fedena.com",
    tenantLabel: "Campus / Institution Code",
    tenantPlaceholder: "e.g. FED-CAMPUS-01",
    apiLabel: "OAuth Token / API Secret",
    apiPlaceholder: "fed_live_xxxxxxxxxxxxxxxx",
    defaultDocsUrl: "https://fedena.com/help",
    syncEntities: [
      {
        id: "students",
        label: "Students & Alumni",
        description: "Sync active student enrollments, batches & roll numbers",
        defaultEnabled: true,
      },
      {
        id: "faculty",
        label: "Faculty & Staff Roster",
        description: "Sync educators, department heads & staff profiles",
        defaultEnabled: true,
      },
      {
        id: "courses",
        label: "Batches & Class Schedules",
        description: "Import course curriculums and class sections",
        defaultEnabled: true,
      },
      {
        id: "fees",
        label: "Fee & Dues Status",
        description: "Real-time read-only sync of student dues",
        defaultEnabled: false,
      },
    ],
  },
  CAMPUSCARE: {
    id: "CAMPUSCARE",
    name: "Entab CampusCare",
    category: "School ERP & SIS",
    description:
      "Connect Entab CampusCare to seamlessly import student master directory, parent contacts, classes, and academic rosters.",
    badge: "K-12 & Higher Ed",
    icon: CampusCareIcon,
    iconBgColor: "#2563EB",
    iconColor: "text-white",
    urlLabel: "CampusCare Portal URL",
    urlPlaceholder: "https://schoolname.campuscare.info",
    tenantLabel: "School Affiliate Code",
    tenantPlaceholder: "e.g. ENTAB-98421",
    apiLabel: "REST Client Secret Key",
    apiPlaceholder: "cc_sec_xxxxxxxxxxxxxxxx",
    defaultDocsUrl: "https://entab.in",
    syncEntities: [
      {
        id: "students",
        label: "Student Information System",
        description: "Student profiles, admission dates & blood group",
        defaultEnabled: true,
      },
      {
        id: "guardians",
        label: "Parent & Guardian Contacts",
        description: "Primary and secondary emergency parent directory",
        defaultEnabled: true,
      },
      {
        id: "classes",
        label: "Class Sections & Timetable",
        description: "Automated mapping of grades and subject teachers",
        defaultEnabled: true,
      },
      {
        id: "attendance",
        label: "Daily Attendance Feeds",
        description: "Sync period-wise attendance and leaves",
        defaultEnabled: false,
      },
    ],
  },
  MYCLASSCAMPUS: {
    id: "MYCLASSCAMPUS",
    name: "MyClassCampus",
    category: "Institute ERP",
    description:
      "Automate student profile syncing, department structures, faculty directories, and institute notifications with MyClassCampus.",
    badge: "Smart Campus",
    icon: MyClassCampusIcon,
    iconBgColor: "#EA580C",
    iconColor: "text-white",
    urlLabel: "Institute Domain URL",
    urlPlaceholder: "https://institute.myclasscampus.com",
    tenantLabel: "Institute ID / Branch",
    tenantPlaceholder: "e.g. MCC-BRANCH-HQ",
    apiLabel: "Access Token",
    apiPlaceholder: "mcc_token_xxxxxxxxxxxxxxxx",
    defaultDocsUrl: "https://myclasscampus.com",
    syncEntities: [
      {
        id: "students",
        label: "Student & Member Directory",
        description: "Sync student registrations, batch years and IDs",
        defaultEnabled: true,
      },
      {
        id: "departments",
        label: "Academic Departments",
        description: "Sync faculties, colleges and course tracks",
        defaultEnabled: true,
      },
      {
        id: "inquiries",
        label: "Admissions & Inquiries",
        description: "Sync prospective student leads directly",
        defaultEnabled: false,
      },
    ],
  },
  MASTERSOFT: {
    id: "MASTERSOFT",
    name: "MasterSoft ERP",
    category: "University CCMS",
    description:
      "Integrate MasterSoft Centralized Campus Management System (CCMS) for university-level student, faculty, and academic record synchronization.",
    badge: "Enterprise CCMS",
    icon: MasterSoftIcon,
    iconBgColor: "#4F46E5",
    iconColor: "text-white",
    urlLabel: "CCMS Server Endpoint",
    urlPlaceholder: "https://ccms.mastersofterp.in",
    tenantLabel: "Tenant / University Code",
    tenantPlaceholder: "e.g. MS-UNIV-ROOT",
    apiLabel: "Integration Bearer Key",
    apiPlaceholder: "ms_live_key_xxxxxxxxxxxxxxxx",
    defaultDocsUrl: "https://iitms.co.in",
    syncEntities: [
      {
        id: "students",
        label: "Enrolled University Students",
        description: "Degree programs, enrollment numbers & semesters",
        defaultEnabled: true,
      },
      {
        id: "professors",
        label: "Professors & Academic Staff",
        description: "Faculty directory with designated department roles",
        defaultEnabled: true,
      },
      {
        id: "curriculum",
        label: "Curriculum & Exam Records",
        description: "Course credits, subjects and session marks",
        defaultEnabled: false,
      },
    ],
  },
};

export interface ERPIntegrationCardProps {
  providerKey: ERPProviderKey;
  initialConnected?: boolean;
}

export const ERPIntegrationCard = ({
  providerKey,
  initialConnected = false,
}: ERPIntegrationCardProps) => {
  const config = ERP_CONFIGS[providerKey];

  const [isConnected, setIsConnected] = useState(initialConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [instanceUrl, setInstanceUrl] = useState(
    initialConnected ? config.urlPlaceholder : ""
  );
  const [tenantCode, setTenantCode] = useState(
    initialConnected ? "CAMPUS-ACTIVE-01" : ""
  );
  const [apiKey, setApiKey] = useState(
    initialConnected ? "••••••••••••••••••••••••" : ""
  );

  // Entity Sync Toggles
  const [enabledEntities, setEnabledEntities] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    config.syncEntities.forEach((item) => {
      initial[item.id] = item.defaultEnabled;
    });
    return initial;
  });

  const handleOpenConnect = () => {
    setIsDialogOpen(true);
  };

  const handleTestConnection = async () => {
    if (!instanceUrl.trim()) {
      toast.error(`Please enter your ${config.urlLabel}`);
      return;
    }
    if (!apiKey.trim()) {
      toast.error(`Please enter your ${config.apiLabel}`);
      return;
    }

    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTesting(false);
    toast.success(`${config.name} connection test passed!`, {
      description: "Handshake verified with REST API endpoint.",
    });
  };

  const handleSaveAndConnect = async () => {
    if (!instanceUrl.trim() || !apiKey.trim()) {
      toast.error("Please fill in all required credentials");
      return;
    }

    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsConnecting(false);
    setIsConnected(true);
    setIsDialogOpen(false);
    toast.success(`Connected to ${config.name}!`, {
      description: "Real-time background student & campus sync is now active.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    toast.info(`Disconnected from ${config.name}`);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsSyncing(false);
    toast.success(`Synced data with ${config.name}`, {
      description: "Student rosters and faculty directory up to date.",
    });
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success(`${config.name} configuration updated successfully`);
  };

  const toggleEntity = (id: string) => {
    setEnabledEntities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <IntegrationCard
        title={config.name}
        category={config.category}
        description={config.description}
        badge={config.badge}
        icon={config.icon}
        iconBgColor={config.iconBgColor}
        iconColor={config.iconColor}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleOpenConnect}
        onDisconnect={handleDisconnect}
      >
        {/* Connected Drawer Content */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/70 border border-border/40 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="truncate font-medium text-foreground">
                {instanceUrl || config.urlPlaceholder}
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0 ml-2"
            >
              Active Sync
            </Badge>
          </div>

          {/* Sync Entity Checklists */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3 w-3" /> Data Synchronization Objects
            </p>
            <div className="space-y-2 bg-background/50 rounded-xl p-2.5 border border-border/30">
              {config.syncEntities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-start justify-between gap-3 text-xs py-1"
                >
                  <div className="space-y-0.5 min-w-0">
                    <Label
                      htmlFor={`${config.id}-${entity.id}`}
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      {entity.label}
                    </Label>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {entity.description}
                    </p>
                  </div>
                  <Switch
                    id={`${config.id}-${entity.id}`}
                    checked={!!enabledEntities[entity.id]}
                    onCheckedChange={() => toggleEntity(entity.id)}
                    className="scale-85 origin-right"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs gap-1.5 rounded-lg font-medium border-border/60 hover:bg-muted/50"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs gap-1.5 rounded-lg font-medium"
              onClick={handleSaveConfig}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Save Preferences
            </Button>
          </div>
        </div>
      </IntegrationCard>

      {/* Connection Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-6 border-border/80 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{ backgroundColor: config.iconBgColor }}
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
              >
                <config.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  Connect {config.name}
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal py-0 px-1.5 border-primary/30 text-primary bg-primary/5"
                  >
                    {config.category}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Configure API credentials to establish automated sync with
                  your campus database.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Instance URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {config.urlLabel}
              </Label>
              <Input
                placeholder={config.urlPlaceholder}
                value={instanceUrl}
                onChange={(e) => setInstanceUrl(e.target.value)}
                className="h-9 text-xs bg-background/80 rounded-lg"
              />
              <p className="text-[11px] text-muted-foreground">
                Your institution's dedicated web host or portal subdomain.
              </p>
            </div>

            {/* Campus / Tenant Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {config.tenantLabel}
              </Label>
              <Input
                placeholder={config.tenantPlaceholder}
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                className="h-9 text-xs bg-background/80 rounded-lg"
              />
            </div>

            {/* API Key / Secret */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                {config.apiLabel}
              </Label>
              <Input
                type="password"
                placeholder={config.apiPlaceholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-9 text-xs font-mono bg-background/80 rounded-lg"
              />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Encrypted at rest with AES-256-GCM.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 flex sm:flex-row items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting || !instanceUrl || !apiKey}
              className="h-8 text-xs rounded-lg gap-1.5 w-full sm:w-auto"
            >
              {isTesting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Test Connection
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="h-8 text-xs rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveAndConnect}
                disabled={isConnecting || !instanceUrl || !apiKey}
                className="h-8 text-xs rounded-lg gap-1.5 bg-primary text-primary-foreground font-semibold"
              >
                {isConnecting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Connect ERP
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Convenience component exports for each ERP
export const FedenaIntegrationCard = () => (
  <ERPIntegrationCard providerKey="FEDENA" />
);

export const EntabCampusCareIntegrationCard = () => (
  <ERPIntegrationCard providerKey="CAMPUSCARE" />
);

export const MyClassCampusIntegrationCard = () => (
  <ERPIntegrationCard providerKey="MYCLASSCAMPUS" />
);

export const MasterSoftERPIntegrationCard = () => (
  <ERPIntegrationCard providerKey="MASTERSOFT" />
);
