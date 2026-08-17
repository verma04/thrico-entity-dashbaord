"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Network,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useGetCRMCommunityRules,
  useUpsertCRMCommunityRule,
  useDeleteCRMCommunityRule,
  CRMProvider,
  CRMCommunityRule,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";
import { cn } from "@/lib/utils";

const OPERATORS = [
  { value: "EQUALS", label: "Equals (=)" },
  { value: "CONTAINS", label: "Contains" },
  { value: "STARTS_WITH", label: "Starts With" },
  { value: "IN", label: "In List (comma separated)" },
  { value: "NOT_EQUALS", label: "Does Not Equal (!=)" },
];

export default function CRMCommunityRulesPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CRMCommunityRule | null>(null);

  // Form State
  const [ruleName, setRuleName] = useState("");
  const [provider, setProvider] = useState<CRMProvider>(CRMProvider.SALESFORCE);
  const [sourceField, setSourceField] = useState("");
  const [operator, setOperator] = useState("EQUALS");
  const [matchValue, setMatchValue] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { data, loading, refetch } = useGetCRMCommunityRules({
    provider: selectedProvider !== "ALL" ? (selectedProvider as CRMProvider) : undefined,
  });

  const [upsertRule, { loading: saving }] = useUpsertCRMCommunityRule();
  const [deleteRule] = useDeleteCRMCommunityRule();

  const rules = data?.getCRMCommunityRules || [];

  const handleOpenCreate = () => {
    setEditingRule(null);
    setRuleName("");
    setProvider(CRMProvider.SALESFORCE);
    setSourceField("");
    setOperator("EQUALS");
    setMatchValue("");
    setCommunityId("");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rule: CRMCommunityRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setProvider(rule.provider);
    setSourceField(rule.sourceField);
    setOperator(rule.operator);
    setMatchValue(rule.matchValue);
    setCommunityId(rule.communityId);
    setIsActive(rule.isActive);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !sourceField || !matchValue || !communityId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await upsertRule({
        variables: {
          input: {
            id: editingRule?.id || undefined,
            provider,
            name: ruleName.trim(),
            sourceField: sourceField.trim(),
            operator,
            matchValue: matchValue.trim(),
            communityId: communityId.trim(),
            isActive,
          },
        },
      });

      if (res.data?.upsertCRMCommunityRule) {
        toast.success(editingRule ? "Rule updated successfully!" : "Rule created successfully!");
        setIsDialogOpen(false);
        refetch();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to save community rule");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteRule({ variables: { id } });
      toast.success(`Deleted rule "${name}"`);
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete rule");
    }
  };

  const handleToggleActive = async (rule: CRMCommunityRule, checked: boolean) => {
    try {
      await upsertRule({
        variables: {
          input: {
            id: rule.id,
            provider: rule.provider,
            name: rule.name,
            sourceField: rule.sourceField,
            operator: rule.operator,
            matchValue: rule.matchValue,
            communityId: rule.communityId,
            isActive: checked,
          },
        },
      });
      toast.success(`Rule "${rule.name}" is now ${checked ? "active" : "paused"}`);
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to update rule status");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Community Routing Rules"
        description="Automatically route synchronized CRM members into targeted Thrico communities based on attributes."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub", href: "/integrations/crm" },
          { label: "Community Rules" },
        ]}
        icon={ShieldCheck}
        badgeText={`${rules.length} Active Rules`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleOpenCreate}
            >
              <Plus className="h-3.5 w-3.5" />
              New Rule
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-4">
          {/* Provider Filter */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 shadow-sm text-xs">
            <span className="text-muted-foreground font-medium">Filter by Platform:</span>
            <div className="flex items-center gap-2">
              <Select
                value={selectedProvider}
                onValueChange={(val) => setSelectedProvider(val)}
              >
                <SelectTrigger className="h-8 text-xs w-[160px] bg-background/60">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Providers</SelectItem>
                  {Object.values(CRMProvider).map((p) => (
                    <SelectItem key={p} value={p}>
                      {CRM_PROVIDERS_CONFIG[p]?.name || p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rules Table */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-medium">
                    <th className="py-3 px-4">Rule Name</th>
                    <th className="py-3 px-4">CRM Platform</th>
                    <th className="py-3 px-4">Criteria Condition</th>
                    <th className="py-3 px-4">Target Community</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {loading && rules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 opacity-50" />
                        Loading routing rules...
                      </td>
                    </tr>
                  ) : rules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No community routing rules configured yet. Click "New Rule" to set up automated onboarding.
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => {
                      const pConfig = CRM_PROVIDERS_CONFIG[rule.provider];
                      return (
                        <tr key={rule.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {rule.name}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium text-white"
                              style={{ backgroundColor: pConfig?.color || "#555" }}
                            >
                              {pConfig?.name || rule.provider}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            <span className="text-primary font-semibold">{rule.sourceField}</span>{" "}
                            <span className="text-muted-foreground">{rule.operator}</span>{" "}
                            <strong className="text-foreground">"{rule.matchValue}"</strong>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                            {rule.communityId}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={(checked) => handleToggleActive(rule, checked)}
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleOpenEdit(rule)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(rule.id, rule.name)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Upsert Rule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <DialogTitle className="text-sm">
                  {editingRule ? "Edit Community Rule" : "Create Community Routing Rule"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                When a CRM record is ingested, match conditions will auto-assign the member into the destination community.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Rule Name</Label>
                <Input
                  placeholder="e.g. VIP Customers to Enterprise Community"
                  className="h-8 text-xs"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">CRM Provider</Label>
                <Select
                  value={provider}
                  onValueChange={(val) => setProvider(val as CRMProvider)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CRMProvider).map((p) => (
                      <SelectItem key={p} value={p}>
                        {CRM_PROVIDERS_CONFIG[p]?.name || p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Source CRM Field</Label>
                  <Input
                    placeholder="e.g. Department, Tier__c"
                    className="h-8 text-xs font-mono"
                    value={sourceField}
                    onChange={(e) => setSourceField(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Operator</Label>
                  <Select value={operator} onValueChange={setOperator}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Match Value</Label>
                <Input
                  placeholder="e.g. Enterprise, VIP, Partner"
                  className="h-8 text-xs"
                  value={matchValue}
                  onChange={(e) => setMatchValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Target Community ID</Label>
                <Input
                  placeholder="e.g. community_6891a2bc..."
                  className="h-8 text-xs font-mono"
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border text-xs">
                <div>
                  <p className="font-medium text-foreground">Rule Active</p>
                  <p className="text-[10px] text-muted-foreground">Apply condition during sync execution.</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-primary text-primary-foreground"
                disabled={saving}
              >
                {saving ? "Saving..." : editingRule ? "Save Changes" : "Create Rule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
