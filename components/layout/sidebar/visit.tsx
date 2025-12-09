import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Globe2, ExternalLink, Copy, Link2, BadgeCheck } from "lucide-react";
import {
  getCustomDomain,
  getThricoDomain,
} from "../../../graphql/actions/domain";
import { toast } from "sonner"; // or use shadcn/ui toast if available

const Visit = () => {
  const { data } = getThricoDomain();
  const { data: custom } = getCustomDomain();
  const [copied, setCopied] = useState<string | null>(null);

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "thrico.community";

  const thricoDomainUrl = `https://${data?.getThricoDomain?.domain}.${NEXT_PUBLIC_SITE_URL}`;
  const customDomainUrl = custom?.getCustomDomain?.domain
    ? `https://${custom.getCustomDomain.domain}`
    : null;

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Link2 className="mr-1" size={18} />
          Visit Site
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[300px] p-3" align="end">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Globe2 className="text-blue-500 shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                Thrico Domain
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={thricoDomainUrl}
                className="text-blue-500 hover:text-blue-400 text-sm font-medium truncate block"
              >
                {thricoDomainUrl}
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopyUrl(thricoDomainUrl)}
              className="text-muted-foreground hover:text-blue-500 shrink-0"
            >
              <Copy size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(thricoDomainUrl, "_blank")}
              className="text-muted-foreground hover:text-blue-500 shrink-0"
            >
              <ExternalLink size={16} />
            </Button>
          </div>
          {customDomainUrl && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <BadgeCheck className="text-green-500 shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">
                    Custom Domain
                  </div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={customDomainUrl}
                    className="text-green-500 hover:text-green-400 text-sm font-medium truncate block"
                  >
                    {customDomainUrl}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyUrl(customDomainUrl)}
                  className="text-muted-foreground hover:text-green-500 shrink-0"
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(customDomainUrl, "_blank")}
                  className="text-muted-foreground hover:text-green-500 shrink-0"
                >
                  <ExternalLink size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Visit;
