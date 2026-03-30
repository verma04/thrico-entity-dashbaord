"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Clock,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useGetEmailTemplates,
  useDeleteEmailTemplate,
  type EmailTemplate,
} from "@/graphql/actions/email";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTimeAgo(dateString?: string): string {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Template Card
// ---------------------------------------------------------------------------
function TemplateCard({
  template,
  index,
  onPreview,
}: {
  template: EmailTemplate;
  index: number;
  onPreview: (t: EmailTemplate) => void;
}) {
  const router = useRouter();
  const [deleteTemplate, { loading: isDeleting }] = useDeleteEmailTemplate();

  const handleDelete = async () => {
    try {
      const { data } = await deleteTemplate({ variables: { id: template.id } });
      if (data?.deleteEmailTemplate?.success) {
        toast.success("Template deleted.");
      } else {
        toast.error("Failed to delete template.");
      }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Mini preview */}
      <div
        className="relative h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden group/canvas"
        onClick={() => onPreview(template)}
      >
        <div className="absolute inset-0 transition-opacity duration-300 group-hover/canvas:opacity-40">
          <div className="w-[800px] h-[500px] origin-top-left" style={{ transform: "scale(0.18)" }}>
            <iframe
              srcDoc={template.html}
              title="Mini Preview"
              className="w-full h-full border-none pointer-events-none"
              scrolling="no"
            />
          </div>
        </div>
        <div className="relative flex flex-col items-center gap-2 opacity-0 group-hover/canvas:opacity-100 transition-all translate-y-2 group-hover/canvas:translate-y-0 duration-200">
          <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <Eye className="h-4 w-4 text-slate-900" />
          </div>
          <span className="text-xs font-medium bg-slate-900 text-white px-2.5 py-0.5 rounded-full">Preview</span>
        </div>
        <div className="absolute inset-0 bg-transparent group-hover/canvas:bg-slate-50/30 transition-all duration-200" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{template.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{template.subject || "No subject"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] p-1.5">
              <DropdownMenuItem onClick={() => onPreview(template)} className="rounded-md py-2 text-sm">
                <Eye className="h-4 w-4 mr-2 text-slate-400" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/email/templates/create?id=${template.id}`)}
                className="rounded-md py-2 text-sm"
              >
                <Pencil className="h-4 w-4 mr-2 text-slate-400" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleDelete} className="text-red-500 rounded-md py-2 text-sm" disabled={isDeleting}>
                {isDeleting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50">
          <Clock className="h-3 w-3 text-slate-300" />
          <span className="text-xs text-slate-400">Modified {getTimeAgo(template.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Starter Card
// ---------------------------------------------------------------------------
function StarterCard({ name, description, onClick }: { name: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
    >
      <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center mb-3 transition-colors">
        <FileText className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Preview Modal
// ---------------------------------------------------------------------------
function PreviewModal({ template, onClose }: { template: EmailTemplate; onClose: () => void }) {
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/25 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{template.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
              {template.subject || "No subject defined"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setDevice("desktop")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  device === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  device === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Mobile
              </button>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-50 overflow-auto p-6 flex justify-center items-start">
          <div
            className={cn(
              "bg-white shadow-lg transition-all duration-400 origin-top overflow-hidden border border-slate-200",
              device === "desktop" ? "w-[800px] min-h-[600px] rounded-xl" : "w-[375px] h-[667px] rounded-[28px] border-8 border-slate-900"
            )}
            style={{ transform: device === "desktop" ? "scale(0.85)" : "scale(0.8)", marginTop: "12px" }}
          >
            {device === "mobile" && (
              <div className="h-5 bg-slate-900 flex justify-center items-center shrink-0">
                <div className="h-1 w-8 bg-slate-800 rounded-full" />
              </div>
            )}
            <div className="h-full bg-white overflow-auto">
              <iframe
                srcDoc={template.html}
                title="Email Preview"
                className="w-full h-full border-none"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main TemplateList
// ---------------------------------------------------------------------------
export default function TemplateList() {
  const router = useRouter();
  const { data, loading } = useGetEmailTemplates();
  const [preview, setPreview] = React.useState<EmailTemplate | null>(null);

  const templates = data?.getEmailTemplates || [];


  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Email Templates</h1>
          <p className="text-sm text-slate-500 mt-1">
            {templates.length > 0
              ? `${templates.length} template${templates.length !== 1 ? "s" : ""} in your library`
              : "No templates yet. Create one to get started."}
          </p>
        </div>
        <button
          onClick={() => router.push("/email/templates/create")}
          className="flex items-center gap-2 h-11 px-6 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* New template tile */}
        <button
          onClick={() => router.push("/email/templates/create")}
          className="group rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center min-h-[260px] hover:border-slate-300 hover:bg-white transition-all cursor-pointer"
        >
          <div className="h-11 w-11 rounded-2xl border border-slate-200 bg-white group-hover:bg-slate-900 flex items-center justify-center transition-all duration-200">
            <Plus className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <p className="text-sm font-medium text-slate-400 mt-3 group-hover:text-slate-900 transition-colors">
            Blank template
          </p>
        </button>

        {templates.map((template, i) => (
          <TemplateCard key={template.id} template={template} index={i} onPreview={setPreview} />
        ))}
      </div>

      {/* Starter Templates */}
      <div className="space-y-5 pt-8 border-t border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Start from a template</h2>
          <p className="text-sm text-slate-500 mt-0.5">Use one of these pre-built layouts as a starting point.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StarterCard
            name="Welcome Email"
            description="Greet new members to your community"
            onClick={() => router.push("/email/templates/create?type=WELCOME")}
          />
          <StarterCard
            name="Newsletter"
            description="Weekly updates and community highlights"
            onClick={() => router.push("/email/templates/create?type=NEWSLETTER")}
          />
          <StarterCard
            name="Event Invite"
            description="Invite members to upcoming events"
            onClick={() => router.push("/email/templates/create?type=EVENT")}
          />
          <StarterCard
            name="Announcement"
            description="Share important updates or changes"
            onClick={() => router.push("/email/templates/create?type=ANNOUNCEMENT")}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && <PreviewModal template={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}
