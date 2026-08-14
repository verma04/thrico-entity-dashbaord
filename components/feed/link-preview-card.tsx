"use client";

import { useEffect, useState } from "react";
import { fetchLinkPreview } from "@/app/actions/link-preview";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, Globe } from "lucide-react";

export default function LinkPreviewCard({ url }: { url: string }) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchLinkPreview(url)
      .then((data) => {
        if (isMounted) {
          setPreviewData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="mt-3 flex items-center justify-center p-4 border border-border/60 rounded-xl bg-muted/20">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!previewData || !previewData.title) {
    return null;
  }

  let hostname = "";
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    hostname = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-3 no-underline group/link"
    >
      <Card className="overflow-hidden bg-card/60 hover:bg-card border border-border/70 group-hover/link:border-border transition-all duration-200 shadow-xs hover:shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-stretch">
          {previewData.images && previewData.images.length > 0 && (
            <div className="sm:w-44 sm:h-auto h-40 flex-shrink-0 bg-muted overflow-hidden relative">
              <img
                src={previewData.images[0]}
                alt={previewData.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/link:scale-105"
              />
            </div>
          )}
          <div className="p-3.5 flex flex-col justify-center flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium mb-1 truncate">
              {previewData.favicons && previewData.favicons.length > 0 ? (
                <img
                  src={previewData.favicons[0]}
                  alt=""
                  className="w-3.5 h-3.5 rounded-xs shrink-0"
                />
              ) : (
                <Globe className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
              )}
              <span className="truncate">{hostname}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground/40 ml-auto shrink-0 group-hover/link:text-primary transition-colors" />
            </div>

            <h4 className="font-semibold text-sm line-clamp-1 mb-1 text-foreground group-hover/link:text-primary transition-colors">
              {previewData.title}
            </h4>

            {previewData.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {previewData.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </a>
  );
}

