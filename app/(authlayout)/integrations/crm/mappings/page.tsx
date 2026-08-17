"use client";

import React, { useState, useEffect } from "react";
import {
  GitMerge,
  Search,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Database,
  Eye,
  Save,
  AlertCircle,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useGetCRMSchema,
  useDiscoverCRMSchema,
  useGetCRMMappings,
  useLazyGetCRMSuggestedMappings,
  useSaveCRMMappings,
  usePreviewCRMMapping,
  CRMProvider,
  CRMFieldMapping,
  CRMFieldMappingInput,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";
import { cn } from "@/lib/utils";

const TARGET_FIELDS = [
  { value: "email", label: "Email Address (Primary)" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "phone", label: "Phone Number" },
  { value: "company", label: "Company / Organization" },
  { value: "jobTitle", label: "Job Title / Role" },
  { value: "city", label: "City" },
  { value: "country", label: "Country" },
  { value: "membershipTier", label: "Membership Tier" },
  { value: "externalStatus", label: "CRM Status" },
  { value: "customNote", label: "Custom Note" },
];

export default function CRMMappingsPage() {
  const [provider, setProvider] = useState<CRMProvider>(CRMProvider.SALESFORCE);

  // Queries
  const { data: schemaData, loading: schemaLoading, refetch: refetchSchema } = useGetCRMSchema({
    provider,
  });
  const { data: mappingsData, loading: mappingsLoading, refetch: refetchMappings } = useGetCRMMappings({
    provider,
  });

  // Mutations & Lazy Queries
  const [discoverSchema, { loading: discovering }] = useDiscoverCRMSchema();
  const [getSuggestedMappings, { loading: suggesting }] = useLazyGetCRMSuggestedMappings();
  const [saveMappings, { loading: saving }] = useSaveCRMMappings();
  const [previewMapping, { loading: previewing }] = usePreviewCRMMapping();


  // Local state for editable mappings
  const [mappings, setMappings] = useState<CRMFieldMappingInput[]>([]);
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (mappingsData?.getCRMMappings?.mappings) {
      setMappings(
        mappingsData.getCRMMappings.mappings.map((m) => ({
          sourceObject: m.sourceObject,
          sourceField: m.sourceField,
          targetType: m.targetType,
          targetField: m.targetField,
          transformConfig: m.transformConfig || "",
          syncDirection: m.syncDirection || "INBOUND",
          enabled: m.enabled ?? true,
        }))
      );
    }
  }, [mappingsData]);

  const config = CRM_PROVIDERS_CONFIG[provider];
  const discoveredObjects = schemaData?.getCRMSchema?.objects || [];

  const handleDiscover = async () => {
    try {
      const res = await discoverSchema({
        variables: {
          provider,
        },
      });
      if (res.data?.discoverCRMSchema) {
        toast.success(`Discovered ${res.data.discoverCRMSchema.objects.length} objects from ${config.name}`);
        refetchSchema();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to discover CRM schema");
    }
  };

  const handleAddMapping = () => {
    const defaultObj = discoveredObjects[0]?.externalObjectName || "Contact";
    setMappings([
      ...mappings,
      {
        sourceObject: defaultObj,
        sourceField: "",
        targetType: "User",
        targetField: "email",
        transformConfig: "",
        syncDirection: "INBOUND",
        enabled: true,
      },
    ]);
  };

  const handleRemoveMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleMappingChange = (index: number, field: keyof CRMFieldMappingInput, value: any) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], [field]: value };
    setMappings(updated);
  };

  const handleSuggest = async () => {
    try {
      const defaultObj = discoveredObjects[0]?.externalObjectName || "Contact";
      toast.loading("Analyzing CRM schema for suggested mappings...", { id: "suggest-toast" });
      const res = await getSuggestedMappings({
        variables: {
          provider,
          sourceObjectName: defaultObj,
        },
      });

      if (res.data?.getCRMSuggestedMappings && res.data.getCRMSuggestedMappings.length > 0) {
        setMappings(
          res.data.getCRMSuggestedMappings.map((m) => ({
            sourceObject: m.sourceObject,
            sourceField: m.sourceField,
            targetType: m.targetType,
            targetField: m.targetField,
            transformConfig: m.transformConfig || "",
            syncDirection: m.syncDirection || "INBOUND",
            enabled: m.enabled ?? true,
          }))
        );
        toast.success("Loaded AI recommended field mappings!", { id: "suggest-toast" });
      } else {
        const suggested: CRMFieldMappingInput[] = [
          { sourceObject: defaultObj, sourceField: "Email", targetType: "User", targetField: "email", syncDirection: "INBOUND", enabled: true },
          { sourceObject: defaultObj, sourceField: "FirstName", targetType: "User", targetField: "firstName", syncDirection: "INBOUND", enabled: true },
          { sourceObject: defaultObj, sourceField: "LastName", targetType: "User", targetField: "lastName", syncDirection: "INBOUND", enabled: true },
          { sourceObject: defaultObj, sourceField: "Phone", targetType: "User", targetField: "phone", syncDirection: "INBOUND", enabled: true },
          { sourceObject: defaultObj, sourceField: "Company", targetType: "User", targetField: "company", syncDirection: "INBOUND", enabled: true },
          { sourceObject: defaultObj, sourceField: "Title", targetType: "User", targetField: "jobTitle", syncDirection: "INBOUND", enabled: true },
        ];
        setMappings(suggested);
        toast.success("Loaded default recommended field mappings!", { id: "suggest-toast" });
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate suggestions", { id: "suggest-toast" });
    }
  };


  const handleSave = async () => {
    if (mappings.length === 0) {
      toast.error("Please configure at least one field mapping");
      return;
    }

    try {
      const res = await saveMappings({
        variables: {
          provider,
          mappings: mappings.map((m) => ({
            sourceObject: m.sourceObject,
            sourceField: m.sourceField,
            targetType: m.targetType,
            targetField: m.targetField,
            transformConfig: m.transformConfig || undefined,
            syncDirection: m.syncDirection || "INBOUND",
            enabled: m.enabled ?? true,
          })),
        },
      });

      if (res.data?.saveCRMMappings) {
        toast.success(`Saved Mappings Version ${res.data.saveCRMMappings.version}!`);
        refetchMappings();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to save field mappings");
    }
  };

  const handlePreview = async () => {
    try {
      const res = await previewMapping({
        variables: {
          provider,
          sourceObjectName: mappings[0]?.sourceObject || "Contact",
          mappings,
        },
      });
      if (res.data?.previewCRMMapping) {
        setPreviewResult(res.data.previewCRMMapping);
        setIsPreviewOpen(true);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to preview mapping transformation");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Schema Discovery & Field Mappings"
        description="Discover custom objects from CRM providers and map attributes to Thrico member profiles."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub", href: "/integrations/crm" },
          { label: "Field Mappings" },
        ]}
        icon={GitMerge}
        badgeText={`Version ${mappingsData?.getCRMMappings?.version || 1}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleDiscover}
              disabled={discovering}
            >
              <Database className={cn("h-3.5 w-3.5", discovering && "animate-spin")} />
              {discovering ? "Discovering..." : "Discover Schema"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleSuggest}
              disabled={suggesting}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Auto-Suggest
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Mappings"}
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-5">
          {/* Provider Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-muted/40 rounded-xl border border-border/50 w-fit">
            {Object.values(CRMProvider).map((p) => {
              const pConfig = CRM_PROVIDERS_CONFIG[p];
              const isSelected = provider === p;
              return (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer",
                    isSelected
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: pConfig?.color || "#555" }}
                  />
                  {pConfig?.name || p}
                </button>
              );
            })}
          </div>

          {/* Schema Discovered Summary Bar */}
          <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: config?.color || "#333" }}
              >
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {config?.name} Schema Objects
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {discoveredObjects.length > 0
                    ? `${discoveredObjects.length} CRM Objects available (${discoveredObjects
                        .map((o) => o.displayName || o.externalObjectName)
                        .slice(0, 4)
                        .join(", ")})`
                    : "No discovered schema cached yet. Click 'Discover Schema' to pull objects."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handlePreview}
              >
                <Eye className="h-3 w-3" />
                Test & Preview
              </Button>
            </div>
          </div>

          {/* Mappings Table */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="p-3.5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground">
                  Active Field Mappings ({mappings.length})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Configure bidirectional property transformations from {config.name} to Thrico.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={handleAddMapping}
              >
                <Plus className="h-3 w-3" />
                Add Mapping
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-medium">
                    <th className="py-2.5 px-4 w-[160px]">Source Object</th>
                    <th className="py-2.5 px-4 w-[200px]">Source CRM Field</th>
                    <th className="py-2.5 px-4 w-[60px] text-center">Direction</th>
                    <th className="py-2.5 px-4 w-[200px]">Thrico Target Field</th>
                    <th className="py-2.5 px-4">Transform Config (JSON)</th>
                    <th className="py-2.5 px-4 w-[70px] text-center">Enabled</th>
                    <th className="py-2.5 px-4 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {mappings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-muted-foreground">
                        No field mappings defined yet. Click "Add Mapping" or "Auto-Suggest" to start.
                      </td>
                    </tr>
                  ) : (
                    mappings.map((mapping, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="py-2.5 px-4">
                          <Input
                            className="h-7 text-xs font-mono"
                            value={mapping.sourceObject}
                            placeholder="e.g. Contact"
                            onChange={(e) =>
                              handleMappingChange(idx, "sourceObject", e.target.value)
                            }
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <Input
                            className="h-7 text-xs font-mono"
                            value={mapping.sourceField}
                            placeholder="e.g. Email / Full_Name__c"
                            onChange={(e) =>
                              handleMappingChange(idx, "sourceField", e.target.value)
                            }
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {mapping.syncDirection || "INBOUND"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-4">
                          <Select
                            value={mapping.targetField}
                            onValueChange={(val) =>
                              handleMappingChange(idx, "targetField", val)
                            }
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Select Target" />
                            </SelectTrigger>
                            <SelectContent>
                              {TARGET_FIELDS.map((f) => (
                                <SelectItem key={f.value} value={f.value}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2.5 px-4">
                          <Input
                            className="h-7 text-xs font-mono"
                            value={mapping.transformConfig || ""}
                            placeholder='e.g. {"trim": true, "lowercase": true}'
                            onChange={(e) =>
                              handleMappingChange(idx, "transformConfig", e.target.value)
                            }
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <Switch
                            checked={mapping.enabled ?? true}
                            onCheckedChange={(checked) =>
                              handleMappingChange(idx, "enabled", checked)
                            }
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveMapping(idx)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <DialogTitle className="text-sm">Mapping Transformation Preview</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Live sample record transformation output using current mapping schema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <p className="font-semibold text-foreground mb-1">Raw Sample Record</p>
              <pre className="p-2.5 rounded-lg bg-muted text-[11px] font-mono overflow-x-auto max-h-[140px]">
                {previewResult?.rawRecord || '{"Id": "003XX00001", "Email": "john.doe@example.com", "FirstName": "John", "LastName": "Doe"}'}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Normalized Output Record
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-[140px] border border-slate-800">
                {previewResult?.normalizedRecord || '{"email": "john.doe@example.com", "firstName": "John", "lastName": "Doe"}'}
              </pre>
            </div>

            {previewResult?.validationErrors && previewResult.validationErrors.length > 0 && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-[11px] space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Validation Warnings
                </p>
                {previewResult.validationErrors.map((err: string, i: number) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
