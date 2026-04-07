"use client";

import React, { useEffect } from "react";
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
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200"
    >
      {/* Thumbnail preview */}
      <div
        className="relative bg-[#f8f9fb] border-b border-slate-100 cursor-pointer overflow-hidden"
        style={{ height: 180 }}
        onClick={() => onPreview(template)}
      >
        {/* Fake browser chrome strip */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/80 border-b border-slate-200/60 shrink-0">
          <div className="h-2 w-2 rounded-full bg-red-400/70" />
          <div className="h-2 w-2 rounded-full bg-amber-400/70" />
          <div className="h-2 w-2 rounded-full bg-green-400/70" />
          <div className="flex-1 mx-2 h-3 bg-white/80 rounded border border-slate-200/60" />
        </div>

        {/* Scaled iframe */}
        <div className="absolute inset-x-0 bottom-0" style={{ top: 28 }}>
          <div
            className="w-full"
            style={{
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {template.html ? (
              <div
                style={{
                  width: "600px",
                  height: "800px",
                  transform: "scale(0.265)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                <iframe
                  srcDoc={template.html}
                  title="Mini Preview"
                  className="w-full h-full border-none"
                  scrolling="no"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-slate-200" />
              </div>
            )}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Eye className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-[11px] font-semibold text-white bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
              Preview template
            </span>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-slate-900 truncate">{template.name}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{template.subject || "No subject"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
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
              {template.isDeletable && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 rounded-md py-2 text-sm" disabled={isDeleting}>
                  {isDeleting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-50">
          <Clock className="h-2.5 w-2.5 text-slate-300" />
          <span className="text-[11px] text-slate-400">Edited {getTimeAgo(template.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Starter Card
// ---------------------------------------------------------------------------
function StarterCard({ name, description, onClick, color }: {
  name: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm hover:shadow-indigo-50 transition-all text-left"
    >
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: color + "18", border: `1px solid ${color}30` }}
      >
        <FileText className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[12.5px] font-semibold text-slate-900 truncate">{name}</h4>
        <p className="text-[11px] text-slate-500 leading-snug truncate">{description}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Preview Modal — full-height side panel with proper iframe sizing
// ---------------------------------------------------------------------------
function PreviewModal({ template, onClose, onEdit }: {
  template: EmailTemplate;
  onClose: () => void;
  onEdit: () => void;
}) {
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-100 flex"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

      {/* Slide-in panel — right side */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.9 }}
        className="relative ml-auto w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Panel header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Mail className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate">{template.name}</p>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{template.subject || "No subject"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Device toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg gap-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
                  device === "desktop"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
                  device === "mobile"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>

            {/* Edit CTA */}
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold rounded-lg transition-all shadow-sm shadow-indigo-200"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Preview area ── */}
        <div className="flex-1 bg-[#f3f4f8] overflow-auto flex flex-col items-center py-8 gap-0">
          <AnimatePresence mode="wait">
            {device === "desktop" ? (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="w-full max-w-[700px] flex flex-col"
              >
                {/* Desktop chrome */}
                <div className="bg-slate-200 rounded-t-xl px-4 py-2.5 flex items-center gap-2 border border-slate-300 border-b-0">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-2 h-5 bg-white rounded border border-slate-300 flex items-center px-2 gap-1">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="text-[9px] text-slate-400 font-medium truncate">
                      {template.name} — Email Preview
                    </div>
                  </div>
                </div>
                {/* Email body */}
                <div className="bg-white border border-slate-300 rounded-b-xl overflow-hidden shadow-lg" style={{ minHeight: 600 }}>
                  <iframe
                    srcDoc={template.html || "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content</div>"}
                    title="Email Preview"
                    className="w-full border-none block"
                    style={{ height: 700 }}
                    sandbox="allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="relative flex flex-col items-center"
              >
                {/* Phone frame */}
                <div className="relative bg-slate-900 rounded-[36px] p-[10px] shadow-2xl shadow-slate-900/40 border-4 border-slate-800"
                  style={{ width: 390, height: 720 }}>
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-24 bg-slate-900 rounded-full z-10" />
                  {/* Status bar */}
                  <div className="absolute top-0 inset-x-3 h-10 bg-slate-900 rounded-t-[28px] flex items-start justify-between px-5 pt-2 z-10">
                    <span className="text-[10px] font-bold text-white">9:41</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 w-3.5 border border-white/60 rounded-sm">
                        <div className="h-full w-2/3 bg-white/80 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  {/* Screen */}
                  <div className="h-full w-full bg-white rounded-[26px] overflow-hidden mt-1">
                    <iframe
                      srcDoc={template.html || "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content</div>"}
                      title="Email Preview Mobile"
                      className="w-full h-full border-none block"
                      sandbox="allow-popups allow-popups-to-escape-sandbox"
                    />
                  </div>
                  {/* Home indicator */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-20 bg-white/40 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            Last edited {getTimeAgo(template.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 h-8 px-4 bg-slate-900 hover:bg-black text-white text-[12px] font-semibold rounded-lg transition-all"
            >
              <Pencil className="h-3 w-3" /> Edit Template
            </button>
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
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Email Templates</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {templates.length > 0
              ? `${templates.length} template${templates.length !== 1 ? "s" : ""} in your library`
              : "No templates yet. Create one to get started."}
          </p>
        </div>
        <button
          onClick={() => router.push("/email/templates/create")}
          className="flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[12.5px] font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          New Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* New template tile */}
        <button
          onClick={() => router.push("/email/templates/create")}
          className="group rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
          style={{ minHeight: 240 }}
        >
          <div className="h-10 w-10 rounded-xl border border-slate-200 bg-white group-hover:bg-indigo-600 group-hover:border-indigo-600 flex items-center justify-center transition-all duration-200 shadow-sm">
            <Plus className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <p className="text-[12.5px] font-medium text-slate-400 mt-2.5 group-hover:text-indigo-600 transition-colors">
            Create template
          </p>
        </button>

        {templates.map((template, i) => (
          <TemplateCard key={template.id} template={template} index={i} onPreview={setPreview} />
        ))}
      </div>

      {/* Starter Templates */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <h2 className="text-[13px] font-semibold text-slate-900">Start from a template</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StarterCard
            name="Welcome Email"
            description="Greet new members to your community"
            onClick={() => router.push("/email/templates/create?type=WELCOME")}
            color="#4f46e5"
          />
          <StarterCard
            name="Newsletter"
            description="Weekly updates and community highlights"
            onClick={() => router.push("/email/templates/create?type=NEWSLETTER")}
            color="#10b981"
          />
          <StarterCard
            name="Event Invite"
            description="Invite members to upcoming events"
            onClick={() => router.push("/email/templates/create?type=EVENT")}
            color="#7c3aed"
          />
          <StarterCard
            name="Announcement"
            description="Share important updates or changes"
            onClick={() => router.push("/email/templates/create?type=ANNOUNCEMENT")}
            color="#d97706"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <PreviewModal
            template={preview}
            onClose={() => setPreview(null)}
            onEdit={() => {
              router.push(`/email/templates/create?id=${preview.id}`);
              setPreview(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
