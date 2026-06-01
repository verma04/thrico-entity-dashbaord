"use client";

import { useEffect, useState } from "react";
import { fetchLinkPreview } from "@/app/actions/link-preview";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LinkPreviewCard({ url }: { url: string }) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchLinkPreview(url).then((data) => {
      if (isMounted) {
        setPreviewData(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="mt-3 flex items-center justify-center p-6 border rounded-2xl bg-muted/20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!previewData || !previewData.title) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-3 no-underline group">
      <Card className="overflow-hidden bg-card transition-all hover:shadow-md ring-1 ring-border/50 hover:ring-border rounded-2xl">
        <div className="flex flex-col sm:flex-row">
          {previewData.images && previewData.images.length > 0 && (
            <div className="sm:w-40 sm:h-auto h-48 flex-shrink-0 bg-muted overflow-hidden">
              <img 
                src={previewData.images[0]} 
                alt={previewData.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
            <h4 className="font-bold text-[15px] line-clamp-2 mb-1.5 text-foreground group-hover:text-primary transition-colors">{previewData.title}</h4>
            {previewData.description && (
              <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {previewData.description}
              </p>
            )}
            <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold truncate flex items-center gap-2">
              {previewData.favicons && previewData.favicons.length > 0 && (
                <img src={previewData.favicons[0]} alt="" className="w-3.5 h-3.5 rounded-sm" />
              )}
              {new URL(url).hostname.replace(/^www\./, '')}
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
