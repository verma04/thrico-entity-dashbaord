"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Pencil, X, Monitor, Smartphone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type EmailTemplate } from "@/graphql/actions/email";
import { Button } from "@/components/ui/button";

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

export function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: EmailTemplate;
  onClose: () => void;
}) {
  const router = useRouter();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const onEdit = () => {
    router.push(`/email/templates/create?id=${template.id}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-100 flex"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="relative ml-auto w-full max-w-4xl h-full bg-background border-l border-border shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{template.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{template.subject || "No subject"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-muted p-0.5 rounded-lg gap-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all",
                  device === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all",
                  device === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>

            <Button size="sm" onClick={onEdit} className="h-8 gap-1.5 text-[11px] rounded-lg">
              <Pencil className="h-3 w-3" /> Edit
            </Button>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-muted/30 overflow-auto flex flex-col items-center py-8">
          {device === "desktop" ? (
            <div className="w-full max-w-[700px] flex flex-col">
              <div className="bg-muted rounded-t-xl px-4 py-2 flex items-center gap-2 border border-border border-b-0">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <div className="flex-1 mx-2 h-4 bg-background rounded border border-border" />
              </div>
              <div className="bg-background border border-border rounded-b-xl overflow-hidden" style={{ minHeight: 600 }}>
                <iframe
                  srcDoc={template.html || "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content</div>"}
                  title="Email Preview"
                  className="w-full border-none block"
                  style={{ height: 700 }}
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          ) : (
            <div
              className="relative bg-foreground rounded-[32px] p-2 shadow-lg border-4 border-muted"
              style={{ width: 370, height: 680 }}
            >
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-20 bg-foreground rounded-full z-10" />
              <div className="h-full w-full bg-background rounded-[24px] overflow-hidden mt-1">
                <iframe
                  srcDoc={template.html || "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content</div>"}
                  title="Mobile Preview"
                  className="w-full h-full border-none block"
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last edited {getTimeAgo(template.updatedAt)}
          </div>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 gap-1.5 text-[11px] rounded-lg">
            <Pencil className="h-3 w-3" /> Edit Template
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
