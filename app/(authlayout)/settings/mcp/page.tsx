"use client";

import React, { useState } from "react";
import {
  Terminal,
  Key,
  Activity,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCcw,
  Clock,
  ChevronRight,
  Database,
  Cpu,
  ChevronDown,
  Pause,
  Play,
  BookOpen,
  Link,
  ExternalLink,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetMCPKeys,
  useGetMCPLogs,
  useGenerateMCPKey,
  useRevokeMCPKey,
  useUpdateMCPKey,
} from "@/graphql/actions/mcp";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function MCPPage() {
  const [activeTab, setActiveTab] = useState<"keys" | "logs">("keys");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<any>(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPermission, setCustomPermission] = useState("");

  // GraphQL hooks
  const {
    data: keysData,
    loading: keysLoading,
    refetch: refetchKeys,
  } = useGetMCPKeys();
  const {
    data: logsData,
    loading: logsLoading,
    refetch: refetchLogs,
  } = useGetMCPLogs(50);
  const [generateKey, { loading: generating }] = useGenerateMCPKey({
    onCompleted: (data: any) => {
      setGeneratedKey(data.generateMCPKey);
      setIsGenerateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate key");
    },
  });
  const [revokeKey] = useRevokeMCPKey({
    onCompleted: () => {
      toast.success("Key revoked successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to revoke key");
    },
  });

  const [updateKey] = useUpdateMCPKey({
    onCompleted: () => {
      toast.success("Key status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update key status");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [] as string[],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Key name is required")
        .min(3, "Name must be at least 3 characters"),
      permissions: Yup.array().min(1, "Select at least one permission"),
    }),
    onSubmit: (values) => {
      generateKey({
        variables: {
          name: values.name,
          permissions: values.permissions,
        },
      });
    },
  });

  const togglePermission = (permId: string) => {
    const prev = formik.values.permissions;
    formik.setFieldValue(
      "permissions",
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
    formik.setFieldTouched("permissions", true);
  };

  const suggestedPermissions = ["create_feed", "create_poll"];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const keyColumns = [
    {
      key: "name",
      header: "Key Name",
      cell: (key: any) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
              key.status === "ACTIVE"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-zinc-50 border-zinc-200 text-zinc-400",
            )}
          >
            <Key className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {key.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {key.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (key: any) => (
        <Badge
          variant={key.status === "ACTIVE" ? "success" : "secondary"}
          className="rounded-md uppercase tracking-wider text-[9px] px-2 py-0.5"
        >
          {key.status}
        </Badge>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      cell: (key: any) => (
        <div className="flex flex-wrap gap-1">
          {key.permissions.map((p: string) => (
            <span
              key={p}
              className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200/50 uppercase font-medium"
            >
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (key: any) => (
        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
          <Clock className="h-3 w-3 opacity-60" />
          {moment(key.createdAt).format("MMM D, YYYY · HH:mm")}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (key: any) => (
        <div className="flex justify-end gap-1">
          {key.status === "ACTIVE" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateKey({ variables: { id: key.id, status: "INACTIVE" } })}
              className="h-8 w-8 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              title="Pause Key"
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {key.status === "INACTIVE" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateKey({ variables: { id: key.id, status: "ACTIVE" } })}
              className="h-8 w-8 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              title="Activate Key"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {(key.status === "ACTIVE" || key.status === "INACTIVE") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                revokeKey({ variables: { revokeMcpKeyId: key.id } })
              }
              className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Revoke Key"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const logColumns = [
    {
      key: "timestamp",
      header: "Time",
      cell: (log: any) => (
        <div className="text-xs text-zinc-500 tabular-nums">
          {moment(log.timestamp).format("HH:mm:ss")}
          <div className="text-[9px] opacity-60">
            {moment(log.timestamp).format("MMM D")}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (log: any) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-7 w-7 rounded border flex items-center justify-center",
              log.status === "SUCCESS"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-red-50 border-red-100 text-red-600",
            )}
          >
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground uppercase tracking-tight">
              {log.actionName}
            </span>
            <span className="text-[9px] text-zinc-400 font-medium">
              {log.triggerSource}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (log: any) => (
        <Badge
          variant={log.status === "SUCCESS" ? "success" : "destructive"}
          className="rounded-md uppercase tracking-wider text-[8px] px-1.5 py-0"
        >
          {log.status}
        </Badge>
      ),
    },
    {
      key: "payload",
      header: "Payload",
      cell: (log: any) => (
        <div className="max-w-[200px] truncate font-mono text-[10px] text-zinc-500 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
          {typeof log.payload === "string"
            ? log.payload
            : JSON.stringify(log.payload)}
        </div>
      ),
    },
    {
      key: "result",
      header: "Result",
      cell: (log: any) => (
        <div className="max-w-[200px] truncate font-mono text-[10px] text-zinc-600">
          {typeof log.result === "string"
            ? log.result
            : JSON.stringify(log.result)}
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Model Context Protocol (MCP)"
        badgeText="Infrastructure"
        description="Securely manage API keys and monitor AI-driven backend interactions."
        icon={Terminal}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group grow>
          <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("keys")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2",
                activeTab === "keys"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700",
              )}
            >
              <Key className="h-3.5 w-3.5" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2",
                activeTab === "logs"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700",
              )}
            >
              <Activity className="h-3.5 w-3.5" />
              Activity Log
            </button>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {activeTab === "keys" ? (
            <Button
              onClick={() => setIsGenerateDialogOpen(true)}
              className="h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Generate Key
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchLogs()}
              className="h-9 w-9 rounded-xl border-zinc-200 text-zinc-400 hover:text-foreground"
            >
              <RefreshCcw
                className={cn("h-3.5 w-3.5", logsLoading && "animate-spin")}
              />
            </Button>
          )}
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="mt-6 border-none bg-transparent shadow-none ring-0 p-0">
        {activeTab === "keys" ? (
          <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-sm overflow-hidden p-6 mx-1">
            {/* Connection Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <div className="lg:col-span-1 p-5 rounded-3xl bg-transparent border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center space-y-3 group hover:border-primary/30 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Claude Integration</h4>
                  <p className="text-[11px] text-zinc-500 px-4">Connect your workspace tools directly to Claude Desktop.</p>
                </div>
              </div>

              <div className="lg:col-span-2 p-1 bg-zinc-50 rounded-3xl border border-zinc-200/60 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-zinc-200/60 transition-all hover:bg-white flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                       <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">claude_desktop_config.json</span>
                     </div>
                     <p className="text-[10px] text-zinc-500 leading-relaxed">
                       Add this configuration to your Claude Desktop config file. Replace <span className="font-bold text-zinc-900">&lt;YOUR_API_KEY&gt;</span> with a key generated below.
                     </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    onClick={() => copyToClipboard(`{
  "mcpServers": {
    "thrico": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/client-sse",
        "--url",
        "https://mcp.thrico.app/sse?token=<YOUR_API_KEY>"
      ]
    }
  }
}`)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Config
                  </Button>
                </div>
                <div className="bg-zinc-900 p-4 overflow-x-auto text-left">
                  <pre className="text-[10px] font-mono leading-relaxed text-zinc-300">
                    <span className="text-pink-400">"mcpServers"</span>: {'{'}
                    <br />
                    {'  '}
                    <span className="text-emerald-300">"thrico"</span>: {'{'}
                    <br />
                    {'    '}
                    <span className="text-blue-300">"command"</span>: <span className="text-amber-300">"npx"</span>,
                    <br />
                    {'    '}
                    <span className="text-blue-300">"args"</span>: [
                    <br />
                    {'      '}
                    <span className="text-amber-300">"-y"</span>,
                    <br />
                    {'      '}
                    <span className="text-amber-300">"@modelcontextprotocol/client-sse"</span>,
                    <br />
                    {'      '}
                    <span className="text-amber-300">"--url"</span>,
                    <br />
                    {'      '}
                    <span className="text-amber-300">"https://mcp.thrico.app/sse?token=&lt;YOUR_API_KEY&gt;"</span>
                    <br />
                    {'    '}
                    ]
                    <br />
                    {'  '}
                    {'}'}
                    <br />
                    {'}'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-blue-900">
                  Security Best Practices
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed opacity-80">
                  API keys grant full access to MCP actions. Never share them or
                  expose them in client-side code. Thrico recommends regular key
                  rotation and revoking unused keys.
                </p>
              </div>
            </div>
            <AdminTable
              columns={keyColumns}
              data={keysData?.mcpKeys || []}
              loading={keysLoading}
              keyExtractor={(key) => key.id}
              emptyTitle="No API keys found"
              emptyDescription="Generate a new key to start using MCP."
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-sm overflow-hidden p-6 mx-1">
            <AdminTable
              columns={logColumns}
              data={logsData?.mcpLogs || []}
              loading={logsLoading}
              keyExtractor={(log) => log.id}
              emptyTitle="No activity recorded"
              emptyDescription="AI actions will appear here once the protocol is active."
            />
          </div>
        )}
      </EcosystemContainer>

      {/* Generate Key Dialog */}
      <Dialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Key className="h-5 w-5" />
              </div>
              Generate MCP Key
            </DialogTitle>
            <DialogDescription className="pt-2">
              Give your API key a descriptive name to track its usage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                Key Name
              </label>
              <Input
                name="name"
                placeholder="e.g. Production AI Worker"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "h-11 rounded-xl transition-all font-medium",
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : "border-zinc-200 focus-visible:ring-primary/20",
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-[10px] font-medium text-red-500 ml-1">
                  {formik.errors.name}
                </span>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                  Resource Permissions
                </label>
                {formik.touched.permissions && formik.errors.permissions && (
                  <span className="text-[10px] font-medium text-red-500 mr-1">
                    {formik.errors.permissions}
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-11 rounded-xl border-zinc-200 font-normal text-left px-3 text-xs"
                  >
                    <span className="text-zinc-500">
                      {formik.values.permissions.length === 0
                        ? "Select permissions..."
                        : `${formik.values.permissions.length} permission(s) selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[377px] rounded-xl"
                  align="start"
                >
                  {suggestedPermissions.map((perm) => (
                    <DropdownMenuCheckboxItem
                      key={perm}
                      checked={formik.values.permissions.includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                      className="text-xs py-2 cursor-pointer"
                    >
                      {perm}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex flex-wrap gap-2 mt-3">
                {formik.values.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="pl-2.5 pr-1 py-1 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
                  >
                    {perm}
                    <button
                      type="button"
                      onClick={() => togglePermission(perm)}
                      className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary transition-all opacity-70 hover:opacity-100"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsGenerateDialogOpen(false)}
              className="rounded-xl text-xs font-semibold py-6 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              loading={generating}
              className="rounded-xl bg-primary text-primary-foreground h-12 px-8 text-xs font-bold uppercase tracking-wider"
            >
              Generate Protocol Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Success Dialog */}
      <Dialog
        open={!!generatedKey}
        onOpenChange={(open) => !open && setGeneratedKey(null)}
      >
        <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8 overflow-hidden border-none shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />

          <div className="flex flex-col items-center text-center space-y-6 pt-2">
            <div className="h-16 w-16 rounded-[22px] bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm relative">
              <div className="absolute inset-0 rounded-[22px] bg-emerald-400/20 animate-ping opacity-25" />
              <ShieldCheck className="h-8 w-8 relative z-10" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                Protocol Key Generated
              </DialogTitle>
              <DialogDescription className="text-sm px-4">
                Your new API key is ready. For security reasons, this key will
                only be shown{" "}
                <span className="font-bold text-foreground">once</span>.
              </DialogDescription>
            </div>

            <div className="w-full space-y-3">
              <div className="relative group">
                <div
                  className={cn(
                    "w-full bg-zinc-950 text-white rounded-2xl p-5 font-mono text-sm break-all pr-20 transition-all duration-500 border border-zinc-800",
                    !showFullKey && "blur-[6px] select-none opacity-50",
                  )}
                >
                  {generatedKey?.apiKey}
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="h-9 w-9 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-700/50"
                  >
                    {showFullKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(generatedKey?.apiKey)}
                    disabled={!showFullKey}
                    className={cn(
                      "h-9 w-9 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-700/50 transition-all",
                      copied &&
                        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    )}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800">
                  <AlertCircle className="h-5 w-5 shrink-0 opacity-60" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    Copy this key now. It won't be shown again.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-800">
                  <Link className="h-5 w-5 shrink-0 opacity-60" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold tracking-tight opacity-70">Claude Connector Hint</p>
                    <p className="text-[11px] leading-relaxed font-medium">
                      Use this key as the <span className="font-bold">Client ID</span> with endpoint <span className="font-mono text-[10px] bg-indigo-100/50 px-1 rounded">https://mcp.thrico.app</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setGeneratedKey(null);
                formik.resetForm();
                setShowFullKey(false);
              }}
              className="w-full h-12 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider"
            >
              I've secured the key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
