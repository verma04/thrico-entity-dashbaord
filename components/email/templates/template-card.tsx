"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Pencil, Trash2, Mail, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDeleteEmailTemplate, type EmailTemplate } from "@/graphql/actions/email";
import { Card, CardContent } from "@/components/ui/card";

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

export function TemplateCard({
  template,
  onPreview,
}: {
  template: EmailTemplate;
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
    <Card className="group relative border-border bg-background overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      {/* Thumbnail preview */}
      <div
        className="relative bg-muted/30 border-b border-border/50 cursor-pointer overflow-hidden"
        style={{ height: 160 }}
        onClick={() => onPreview(template)}
      >
        {/* Fake browser chrome strip */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border-b border-border/50 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="flex-1 mx-2 h-2.5 bg-background rounded border border-border/50" />
        </div>

        {/* Scaled iframe */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: 22 }}>
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
              <Mail className="h-6 w-6 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Hover overlay - simplified */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-200" />
      </div>

      {/* Card footer */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-foreground truncate">{template.name}</h3>
            <p className="text-[10px] text-muted-foreground truncate">{template.subject || "No subject"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => onPreview(template)} className="text-xs">
                <Eye className="h-3.5 w-3.5 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/email/templates/create?id=${template.id}`)}
                className="text-xs"
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {template.isDeletable && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 text-xs" disabled={isDeleting}>
                  {isDeleting ? <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-2" />}
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
          <Clock className="h-2.5 w-2.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Edited {getTimeAgo(template.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
